'use client';

import { useEffect, useState } from 'react';
import { ScheduleComponent, Day, Week, Month, Agenda, Inject, ViewDirective, ViewsDirective, WorkWeek } from '@syncfusion/ej2-react-schedule';
import { registerLicense } from '@syncfusion/ej2-base';

registerLicense('Ngo9BigBOggjHTQxAR8/V1NCaF5cXmZCdkx3RXxbf1x0ZFNMYV9bRHBPMyBoS35RckVkWH5ednVWRmdVVU13');
const formatDate = (dateString) => {
  const options = { day: '2-digit', weekday: 'short' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

const formatTime = (dateString) => {
  const options = { hour: '2-digit', minute: '2-digit', hour12: true };
  return new Date(dateString).toLocaleTimeString('en-US', options);
};

export default function Home() {
  const [display, setDisplay] = useState(true);
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/events')
      .then((response) => response.json())
      .then((data) => {
        setEvents(data);
        setFilteredEvents(data.data);
      })
      .catch((error) => {
        console.error('Error fetching events:', error);
      });
  }, []);

  const handleActionComplete = (args) => {
    if (args.requestType === 'eventCreated') {
      fetch('http://localhost:3000/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(args.data[0]),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
        })
        .catch((error) => {
          console.error('Error adding event:', error);
        });
    } else if (args.requestType === 'eventChanged') {
      const eventId = args.data[0].Id;
      const apiUrl = `http://localhost:3000/events/${eventId}`;
      fetch(apiUrl, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(args.data[0]),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
        })
        .catch((error) => {
          console.error('Error updating event:', error);
        });
    } else if (args.requestType === 'eventRemoved') {
      const eventId = args.data[0].Id;
      const apiUrl = `http://localhost:3000/events/${eventId}`;
      fetch(apiUrl, {
        method: 'DELETE',
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
        })
        .catch((error) => {
          console.error('Error removing event:', error);
        });
    }
  };

  const handleSearchClick = (e) => {
    if (e.target.value === '') {
      setDisplay(true);
    } else {
      setDisplay(false);
      const filtered = events.data.filter((event) => {
        const subjectMatch = event.Subject.toLowerCase().includes(e.target.value.toLowerCase());
        const startTimeString = new Date(event.StartTime).toLocaleString().toLowerCase();
        const dayString = new Date(event.StartTime).toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
        const startTimeMatch = startTimeString.includes(e.target.value) || dayString.includes(e.target.value);
        return subjectMatch || startTimeMatch;
      });
      setFilteredEvents(filtered);
    }
  };

  return (
    <main className="w-full">
      <input className="w-1/3 border-2 my-2 ml-2 p-2 rounded-md focus:outline-none text-slate-500 lg:w-1/4" type="text" placeholder="Enter keyword.." onKeyUp={handleSearchClick} />
      {display && (
        <div className="mx-2 shadow-md">
          <ScheduleComponent eventSettings={{ dataSource: events.data }} currentView="Month" actionComplete={handleActionComplete}>
            <Inject services={[Day, Week, Month, WorkWeek, Agenda]} />
          </ScheduleComponent>
        </div>
      )}
      {!display && (
        <div>
          <div className="w-full flex items-center gap-2 mx-2">
            {filteredEvents.map((item) => (
              <div key={item.Id} className="w-[46%] h-36 flex gap-0 items-center rounded-md shadow-md lg:w-[20%] lg:h-32 lg:gap-2">
                <div className="ml-2">
                  <p>{formatDate(item.StartTime)}</p>
                </div>
                <div className="border-l-4 border-blue-900 pl-2 py-2">
                  <h3 className="text- font-medium">{item.Subject}</h3>
                  <p className="text-sm text-slate-500">
                    {formatTime(item.StartTime)} - {formatTime(item.EndTime)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
