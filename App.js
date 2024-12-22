import React, { useState } from "react";
import Calendar from "./components/Calendar";
import EventModal from "./components/EventModal";

const App = () => {
  const [selectedDay, setSelectedDay] = useState(null);
  const [events, setEvents] = useState(
    JSON.parse(localStorage.getItem("events")) || {}
  );

  const handleSelectDay = (day) => setSelectedDay(day);

  const handleSaveEvent = (day, event) => {
    const dateKey = day.format("YYYY-MM-DD");
    const updatedEvents = {
      ...events,
      [dateKey]: [...(events[dateKey] || []), event],
    };
    setEvents(updatedEvents);
    localStorage.setItem("events", JSON.stringify(updatedEvents));
  };

  return (
    <div>
      <Calendar onSelectDay={handleSelectDay} />
      {selectedDay && (
        <EventModal
          day={selectedDay}
          events={events[selectedDay.format("YYYY-MM-DD")] || []}
          onSave={handleSaveEvent}
          onClose={() => setSelectedDay(null)}
        />
      )}
    </div>
  );
};

export default App;
