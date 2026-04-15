const express = require('express');
const router = express.Router();
const agendaController = require('../controller/agendaController');

router.get('/', agendaController.getAgendas);
router.post('/', agendaController.createAgenda);
router.put('/:id/status', agendaController.updateAgendaStatus);
router.delete('/history', agendaController.clearHistory);
router.put('/:id', agendaController.updateAgenda);

module.exports = router;
