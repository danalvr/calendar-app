var express = require('express');
var router = express.Router();

const EventController = require('../controller/event');

router.get('/', EventController.getEvents);
router.post('/', EventController.createNewEvent);
router.patch('/:id', EventController.updateEvent);
router.delete('/:id', EventController.deleteEvent);

module.exports = router;
