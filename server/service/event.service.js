const fs = require('fs');
const path = require('path');

const getEvents = async () => {
  const eventsFilePath = path.join(__dirname, '..', 'data', 'events.json');

  const data = fs.readFileSync(eventsFilePath, 'utf8');
  const events = JSON.parse(data);
  return events;
};

const createNewEvent = async (request) => {
  try {
    const newEvent = request;
    const eventsFilePath = path.join(__dirname, '..', 'data', 'events.json');

    const data = fs.readFileSync(eventsFilePath, 'utf8');
    const events = JSON.parse(data);

    events.push(newEvent);

    fs.writeFileSync(eventsFilePath, JSON.stringify(events, null, 2), 'utf8');

    return newEvent;
  } catch (error) {
    console.error('Error creating event:', error);
  }
};

const updateEvent = async (id, request) => {
  try {
    const eventsFilePath = path.join(__dirname, '..', 'data', 'events.json');

    const data = fs.readFileSync(eventsFilePath, 'utf8');

    let events = JSON.parse(data);

    let eventToUpdate = events.find((event) => event.Id.toString() === id.toString());

    console.log(eventToUpdate);

    if (eventToUpdate) {
      eventToUpdate.Subject = request.Subject || eventToUpdate.Subject;
      eventToUpdate.StartTime = request.StartTime || eventToUpdate.StartTime;
      eventToUpdate.EndTime = request.EndTime || eventToUpdate.EndTime;
      eventToUpdate.IsAllDay = request.IsAllDay || eventToUpdate.IsAllDay;

      fs.writeFileSync(eventsFilePath, JSON.stringify(events, null, 2), 'utf8');

      return eventToUpdate;
    } else {
      throw new Error(`Event with id ${id} not found.`);
    }
  } catch (error) {
    console.error(error);
  }
};

const deleteEvent = async (id) => {
  try {
    const eventsFilePath = path.join(__dirname, '..', 'data', 'events.json');

    const data = fs.readFileSync(eventsFilePath, 'utf8');

    let events = JSON.parse(data);

    const indexToDelete = events.findIndex((event) => event.Id.toString() === id.toString());

    if (indexToDelete !== -1) {
      events.splice(indexToDelete, 1);

      fs.writeFileSync(eventsFilePath, JSON.stringify(events, null, 2), 'utf8');

      return;
    } else {
      throw new Error(`Event with id ${id} not found.`);
    }
  } catch (error) {
    console.error('Error deleting event:', error);
  }
};

module.exports = { getEvents, createNewEvent, updateEvent, deleteEvent };
