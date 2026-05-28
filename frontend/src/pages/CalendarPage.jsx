import { useAppContext } from "../hooks/useAppContext";
import CalendarView from "../features/calendar/CalendarView";

export default function CalendarPage() {
  const { dashboard, user } = useAppContext();
  const isAdmin = user?.role === "admin";

  return (
    <CalendarView
      isAdmin={isAdmin}
      projects={dashboard.projects || []}
      user={user}
    />
  );
}
