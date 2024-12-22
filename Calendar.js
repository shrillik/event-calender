import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import EventModal from "./EventModal";

const weekDays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState(() => {
    const savedEvents = localStorage.getItem("events");
    return savedEvents ? JSON.parse(savedEvents) : {};
  });

  useEffect(() => {
    localStorage.setItem("events", JSON.stringify(events));
  }, [events]);

  const addEvent = (dateKey, event) => {
    const dayEvents = events[dateKey] || [];
    const updatedEvents = {
      ...events,
      [dateKey]: [...dayEvents, event],
    };
    setEvents(updatedEvents); // Update state
  };
  const startOfMonth = currentDate.startOf("month");
  const endOfMonth = currentDate.endOf("month");
  const startDay = startOfMonth.day();
  const daysInMonth = endOfMonth.date();

  const handlePrevMonth = () =>
    setCurrentDate(currentDate.subtract(1, "month"));
  const handleNextMonth = () => setCurrentDate(currentDate.add(1, "month"));

  const handleDayClick = (date) => setSelectedDate(date);

  const handleAddEvent = (newEvent) => {
    const dateKey = selectedDate.format("YYYY-MM-DD");
    const dayEvents = events[dateKey] || [];
    const overlapping = dayEvents.some(
      (event) =>
        (newEvent.startTime >= event.startTime &&
          newEvent.startTime < event.endTime) ||
        (newEvent.endTime > event.startTime &&
          newEvent.endTime <= event.endTime) ||
        (newEvent.startTime <= event.startTime &&
          newEvent.endTime >= event.endTime)
    );

    if (overlapping) {
      alert("Event times overlap! Please adjust the timing.");
      return false;
    }

    const updatedEvents = {
      ...events,
      [dateKey]: [...dayEvents, newEvent],
    };
    setEvents(updatedEvents);
    setSelectedDate(null);
    return true;
  };

  const days = [];
  for (let i = 0; i < startDay; i++) {
    days.push(<div key={`empty-${i}`} className="day other-month"></div>);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    const date = startOfMonth.date(i);
    const isToday = date.isSame(dayjs(), "day");
    const hasEvents = events[date.format("YYYY-MM-DD")];

    days.push(
      <div
        key={i}
        className={`day ${isToday ? "current-day" : ""} ${
          hasEvents ? "has-events" : ""
        }`}
        onClick={() => handleDayClick(date)}
      >
        {i}
      </div>
    );
  }

  return (
    <div className="calendar">
      <header>
        <button onClick={handlePrevMonth}>Previous</button>
        <h2>{currentDate.format("MMMM YYYY")}</h2>
        <button onClick={handleNextMonth}>Next</button>
      </header>
      <div className="weekdays">
        {weekDays.map((day) => (
          <div key={day} className="weekday">
            {day}
          </div>
        ))}
      </div>
      <div className="calendar-grid">{days}</div>
      {selectedDate && (
        <EventModal
          date={selectedDate}
          events={events[selectedDate.format("YYYY-MM-DD")] || []}
          onClose={() => setSelectedDate(null)}
          onSave={handleAddEvent}
        />
      )}
    </div>
  );
};

export default Calendar;
