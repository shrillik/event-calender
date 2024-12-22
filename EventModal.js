import React, { useState, useEffect } from "react";
import dayjs from "dayjs";

const EventModal = ({ date, events, onClose, onSave, onDelete }) => {
  const [name, setName] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [description, setDescription] = useState("");
  const [editingEvent, setEditingEvent] = useState(null);

  useEffect(() => {
    if (events.length === 1) {
      setEditingEvent(events[0]);
      setName(events[0].name);
      setStartTime(events[0].startTime);
      setEndTime(events[0].endTime);
      setDescription(events[0].description);
    }
  }, [events]);

  const handleSave = () => {
    if (!name || !startTime || !endTime) {
      alert("Please fill all required fields.");
      return;
    }

    if (dayjs(endTime).isBefore(dayjs(startTime))) {
      alert("End time must be after start time.");
      return;
    }

    const newEvent = { name, startTime, endTime, description };
    const success = onSave(newEvent, editingEvent); // Pass eventToEdit if editing
    if (success) {
      setName("");
      setStartTime("");
      setEndTime("");
      setDescription("");
      setEditingEvent(null);
    }
  };

  const handleDelete = () => {
    if (editingEvent) {
      onDelete(editingEvent); // Delete the selected event
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Events on {date.format("MMMM DD, YYYY")}</h3>

        {/* Display existing events */}
        {events.length === 0 ? (
          <p>No events for this day.</p>
        ) : (
          <ul>
            {events.map((event, index) => (
              <li key={index}>
                <strong>{event.name}</strong> ({event.startTime} -{" "}
                {event.endTime})<p>{event.description}</p>
                <button onClick={() => setEditingEvent(event)}>Edit</button>
                <button onClick={() => onDelete(event)}>Delete</button>
              </li>
            ))}
          </ul>
        )}

        <h4>{editingEvent ? "Edit Event" : "Add New Event"}</h4>
        <form onSubmit={(e) => e.preventDefault()}>
          <input
            type="text"
            placeholder="Event Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
          />
          <textarea
            placeholder="Optional Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
          <button type="button" onClick={handleSave}>
            {editingEvent ? "Save Changes" : "Save Event"}
          </button>
          <button type="button" onClick={onClose}>
            Close
          </button>
          {editingEvent && (
            <button
              type="button"
              onClick={handleDelete}
              style={{ color: "red" }}
            >
              Delete Event
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default EventModal;
