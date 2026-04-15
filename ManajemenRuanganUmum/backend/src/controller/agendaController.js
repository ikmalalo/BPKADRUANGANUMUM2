const db = require('../config/db');

const timeToMin = (t, referenceStart = null) => {
  if (!t) {
    if (referenceStart !== null) return referenceStart + 300;
    return 0;
  }
  
  const clean = t.toString().trim().toLowerCase().replace('.', ':');
  
  if (clean.includes('selesai')) {
    return referenceStart !== null ? referenceStart + 300 : 1439;
  }
  
  const match = clean.match(/(\d{1,2}):(\d{1,2})/);
  if (!match) {
    if (referenceStart !== null) return referenceStart + 300;
    return 0;
  }
  
  const h = parseInt(match[1]) || 0;
  const m = parseInt(match[2]) || 0;
  return h * 60 + m;
};

const autoUpdateStatuses = async () => {
  try {
    const now = new Date();
    const witaOffset = 8 * 60;
    const witaTime = new Date(now.getTime() + (witaOffset + now.getTimezoneOffset()) * 60000);
    
    const todayWita = new Date(witaTime.getFullYear(), witaTime.getMonth(), witaTime.getDate());
    const currentTimeStr = witaTime.getHours().toString().padStart(2, '0') + ':' + witaTime.getMinutes().toString().padStart(2, '0');
    const cm = timeToMin(currentTimeStr);

    const parseIndoDate = (dateStr) => {
      const match = dateStr.match(/, (\d{1,2}) (\w{3}) (\d{4})/);
      if (!match) return null;
      const day = parseInt(match[1]);
      const monthStr = match[2];
      const year = parseInt(match[3]);
      const monthMap = {
        'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'Mei': 4, 'Jun': 5,
        'Jul': 6, 'Agu': 7, 'Sep': 8, 'Okt': 9, 'Nov': 10, 'Des': 11
      };
      return new Date(year, monthMap[monthStr], day);
    };

    const { rows: agendas } = await db.query('SELECT id, tanggal, pukul, status FROM agenda_ruangan');
    
    for (const agenda of agendas) {
      const agendaDate = parseIndoDate(agenda.tanggal);
      if (!agendaDate) continue;

      const timeParts = agenda.pukul.split(' - ');
      const startTime = timeParts[0];
      const endTime = timeParts[1];

      const sm = timeToMin(startTime);
      const se = timeToMin(endTime, sm);

      if (agendaDate < todayWita) {
        await db.query('UPDATE agenda_ruangan SET status = $1 WHERE id = $2', ["Selesai", agenda.id]);
      } else if (agendaDate.getTime() === todayWita.getTime()) {
        if (cm >= se) {
          await db.query('UPDATE agenda_ruangan SET status = $1 WHERE id = $2', ["Selesai", agenda.id]);
        } else if (agenda.status === 'Terjadwal' && cm >= sm) {
          await db.query('UPDATE agenda_ruangan SET status = $1 WHERE id = $2', ["Berlangsung", agenda.id]);
        }
      }
    }
  } catch (error) {
    console.error('Error in autoUpdateStatuses:', error);
  }
};

const checkConflict = async (ruangan, tanggal, waktuMulai, waktuSelesai, excludeId = null) => {
  const sm = timeToMin(waktuMulai);
  const se = timeToMin(waktuSelesai, sm);
  
  const searchRuangan = ruangan.trim();
  const searchTanggal = tanggal.trim();

  let query = 'SELECT id, pukul, acara FROM agenda_ruangan WHERE TRIM(tempat) = $1 AND TRIM(tanggal) = $2';
  let params = [searchRuangan, searchTanggal];
  
  if (excludeId) {
    query += ' AND id != $3';
    params.push(excludeId);
  }
  
  const { rows: existing } = await db.query(query, params);
  
  for (const row of existing) {
    const timeParts = row.pukul.split(/\s*[-–—]\s*/);
    const exsString = timeParts[0] || '';
    const exeString = timeParts[1] || '';
    
    const exs = timeToMin(exsString);
    const exe = timeToMin(exeString, exs);
    
    if (sm < exe && se > exs) {
      return true;
    }
  }
  
  return false;
};

const getAgendas = async (req, res) => {
  try {
    await autoUpdateStatuses();
    const { rows } = await db.query('SELECT * FROM agenda_ruangan ORDER BY id ASC');
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching agendas:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

const createAgenda = async (req, res) => {
  try {
    const { 
      jenisRuangan, 
      ruangan, 
      tanggal, 
      waktuMulai, 
      waktuSelesai, 
      namaAcara, 
      pelaksana, 
      dihadiri 
    } = req.body;

    const hasConflict = await checkConflict(ruangan, tanggal, waktuMulai, waktuSelesai);
    if (hasConflict) {
      return res.status(400).json({ message: 'Ruangan sudah di booking pada jam tersebut. Silakan pilih jam atau ruangan lain.' });
    }

    const type = jenisRuangan === 'bpkad' ? 'BPKAD' : 'PEMKOT';
    const hari = tanggal.split(',')[0].toUpperCase();
    const pukul = `${waktuMulai} - ${waktuSelesai}`;
    
    const query = `
      INSERT INTO agenda_ruangan (hari, tanggal, tempat, pukul, acara, pelaksana, dihadiri, status, type)
      VALUES ($1, $2, $3, $4, $5, $6, $7, 'Terjadwal', $8)
      RETURNING id
    `;

    const { rows } = await db.query(query, [
      hari,
      tanggal,
      ruangan,
      pukul,
      namaAcara,
      pelaksana,
      dihadiri || null,
      type
    ]);

    res.status(201).json({ 
      message: 'Agenda created successfully', 
      id: rows[0].id 
    });
  } catch (error) {
    console.error('Error creating agenda:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

const updateAgendaStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    let query;
    let result;

    if (status === 'Selesai') {
      query = 'UPDATE agenda_ruangan SET status = $1 WHERE id = $2';
      result = await db.query(query, ["Selesai", id]);
    } else {
      query = 'UPDATE agenda_ruangan SET status = $1 WHERE id = $2';
      result = await db.query(query, [status, id]);
    }

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Agenda not found' });
    }

    res.status(200).json({ 
      message: status === 'Selesai' ? 'Agenda deleted successfully' : 'Status updated successfully' 
    });
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

const updateAgenda = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      jenisRuangan, 
      ruangan, 
      tanggal, 
      waktuMulai, 
      waktuSelesai, 
      namaAcara, 
      pelaksana, 
      dihadiri 
    } = req.body;

    const hasConflict = await checkConflict(ruangan, tanggal, waktuMulai, waktuSelesai, id);
    if (hasConflict) {
      return res.status(400).json({ message: 'Ruangan sudah di booking pada jam tersebut. Silakan pilih jam atau ruangan lain.' });
    }

    const type = jenisRuangan === 'bpkad' ? 'BPKAD' : 'PEMKOT';
    const hari = tanggal.split(',')[0].toUpperCase();
    const pukul = `${waktuMulai} - ${waktuSelesai}`;

    const query = `
      UPDATE agenda_ruangan 
      SET hari = $1, tanggal = $2, tempat = $3, pukul = $4, acara = $5, pelaksana = $6, dihadiri = $7, type = $8
      WHERE id = $9
    `;

    const result = await db.query(query, [
      hari,
      tanggal,
      ruangan,
      pukul,
      namaAcara,
      pelaksana,
      dihadiri || null,
      type,
      id
    ]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Agenda not found' });
    }

    res.status(200).json({ message: 'Agenda updated successfully' });
  } catch (error) {
    console.error('Error updating agenda:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

const clearHistory = async (req, res) => {
  try {
    const result = await db.query("DELETE FROM agenda_ruangan WHERE status = $1", ['Selesai']);
    res.status(200).json({ 
      message: 'Semua riwayat berhasil dihapus', 
      affectedRows: result.rowCount 
    });
  } catch (error) {
    console.error('Error clearing history:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

module.exports = {
  getAgendas,
  createAgenda,
  updateAgendaStatus,
  updateAgenda,
  clearHistory
};

