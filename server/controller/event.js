const eventService = require('../service/event.service');

const getEvents = async (req, res, next) => {
  try {
    const result = await eventService.getEvents();
    res.status(200).json({
      status: 'Success',
      message: 'Get events successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const createNewEvent = async (req, res, next) => {
  try {
    const result = await eventService.createNewEvent(req.body);
    res.status(201).json({
      status: 'Success',
      message: 'Create new event successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const updateEvent = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await eventService.updateEvent(id, req.body);
    res.status(200).json({
      status: 'Success',
      message: 'Update event successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const deleteEvent = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await eventService.deleteEvent(id);
    res.status(200).json({
      status: 'Success',
      message: 'Delete event successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getEvents, createNewEvent, updateEvent, deleteEvent };
