import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import CalendarView from "../../features/calendar/CalendarView";

export default function AdminCalendarPage() {
  const { dashboard, user } = useContext(AppContext);

  return (
    <section className="page admin-calendar-page">
      <CalendarView isAdmin projects={dashboard.projects} user={user} />
    </section>
  );
}
