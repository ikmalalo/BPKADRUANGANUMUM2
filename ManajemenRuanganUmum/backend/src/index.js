const express = require('express');
const cors = require('cors');
require('dotenv').config();

const agendaRoutes = require('./routes/agendaRoutes');
const authRoutes = require('./routes/authRoutes');
const certificateRoutes = require('./routes/certificateRoutes');
const recordRoutes = require('./routes/recordRoutes');

const app = express();
const PORT = process.env.PORT || 59489;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes
app.use('/api/agendas', agendaRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/record', recordRoutes);

app.get('/', (req, res) => {
  res.send('API Agenda Ruangan is running...');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
