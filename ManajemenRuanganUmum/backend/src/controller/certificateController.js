const db = require('../config/db');

// Create table if not exists (PostgreSQL syntax)
const initTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS certificates (
      id SERIAL PRIMARY KEY,
      nama_penerima VARCHAR(255) NOT NULL,
      penghargaan VARCHAR(255) NOT NULL,
      tanggal VARCHAR(255) NOT NULL,
      foto TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  await db.query(query);
};

const getCertificates = async (req, res) => {
  try {
    await initTable();
    const { rows } = await db.query('SELECT * FROM certificates ORDER BY created_at DESC');
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching certificates:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

const createCertificate = async (req, res) => {
  try {
    await initTable();
    const { namaPenerima, penghargaan, tanggal, foto } = req.body;

    const query = `
      INSERT INTO certificates (nama_penerima, penghargaan, tanggal, foto)
      VALUES ($1, $2, $3, $4)
      RETURNING id
    `;

    const { rows } = await db.query(query, [namaPenerima, penghargaan, tanggal, foto]);

    res.status(201).json({ 
      message: 'Certificate created successfully', 
      id: rows[0].id 
    });
  } catch (error) {
    console.error('Error creating certificate:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

const deleteCertificate = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM certificates WHERE id = $1', [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Certificate not found' });
    }

    res.status(200).json({ message: 'Certificate deleted successfully' });
  } catch (error) {
    console.error('Error deleting certificate:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

module.exports = {
  getCertificates,
  createCertificate,
  deleteCertificate
};

