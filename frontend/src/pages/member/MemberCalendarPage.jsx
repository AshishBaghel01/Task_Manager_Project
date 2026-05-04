import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import CalendarView from "../../features/calendar/CalendarView";

export default function MemberCalendarPage() {
  const { dashboard, user } = useContext(AppContext);

  return (
    <section className="page member-calendar-page">
      <CalendarView isAdmin={false} projects={dashboard.projects} user={user} />
    </section>
  );
}
