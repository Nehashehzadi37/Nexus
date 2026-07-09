import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

type MeetingEvent = {
  id: string;
  title: string;
  date: string;
  status: "available" | "pending" | "confirmed" | "rejected";
};

export const MeetingsPage: React.FC = () => {
  const [events, setEvents] = useState<MeetingEvent[]>(() => {
  const savedEvents = localStorage.getItem("meetings");
  return savedEvents ? JSON.parse(savedEvents) : [];
});

useEffect(() => {
  localStorage.setItem("meetings", JSON.stringify(events));
}, [events]);

  // 📌 Add availability slot
  const handleDateClick = (info: any) => {
    const title = prompt("Enter availability (e.g. 10AM - 11AM)");
    if (!title) return;

    const newEvent: MeetingEvent = {
      id: crypto.randomUUID(),
      title,
      date: info.dateStr,
      status: "available",
    };

    setEvents((prev) => [...prev, newEvent]);
  };

  // 🤝 Request meeting
  const requestMeeting = (id: string) => {
    setEvents((prev) =>
      prev.map((ev) =>
        ev.id === id ? { ...ev, status: "pending" } : ev
      )
    );
  };

  // ✅ Accept / Reject
  const updateStatus = (
    id: string,
    status: "confirmed" | "rejected"
  ) => {
    setEvents((prev) =>
      prev.map((ev) =>
        ev.id === id ? { ...ev, status } : ev
      )
    );
  };

  // 🎨 Colors based on status
  const getEventColor = (status: MeetingEvent["status"]) => {
    switch (status) {
      case "available":
        return "#3b82f6"; // blue
      case "pending":
        return "#f59e0b"; // yellow
      case "confirmed":
        return "#22c55e"; // green
      case "rejected":
        return "#ef4444"; // red
      default:
        return "#3b82f6";
    }
  };

  // 📌 Event click actions
  const handleEventClick = (info: any) => {
    const id = info.event.id;

    const action = prompt(
      "Type action: accept / reject / request"
    );

    if (action === "accept") updateStatus(id, "confirmed");
    if (action === "reject") updateStatus(id, "rejected");
    if (action === "request") requestMeeting(id);
  };

  return (
    <section className="space-y-6">
      {/* Header */}
      <header>
        <h1 className="text-3xl font-bold text-gray-900">
          Meetings
        </h1>
        <p className="text-gray-600 mt-2">
          Schedule, organize and manage meetings with investors and entrepreneurs.
        </p>
      </header>

      {/* Calendar Card */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">
          Meeting Scheduler
        </h2>

        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          selectable={true}
          editable={true}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          events={events.map((ev) => ({
            id: ev.id,
            title: ev.title,
            date: ev.date,
            backgroundColor: getEventColor(ev.status),
          }))}
        />
      </div>
    </section>
  );
};