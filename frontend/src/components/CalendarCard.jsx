function isSameDate(left, right) {
  return left.toDateString() === right.toDateString();
}

function getDayMeta(day, projects) {
  const matches = projects.filter((project) => {
    const startDate = new Date(project.startDate);
    const endDate = new Date(project.endDate);
    return (
      isSameDate(day, startDate) ||
      isSameDate(day, endDate) ||
      (day >= startDate && day <= endDate)
    );
  });

  return {
    count: matches.length,
    highlight: matches.some((project) => project.status === "overdue")
      ? "overdue"
      : matches.some((project) => project.status === "completed")
        ? "completed"
        : matches.length
          ? "progress"
          : "idle",
  };
}

export default function CalendarCard({ projects }) {
  const today = new Date();
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  const startWeekday = monthStart.getDay();
  const totalDays = monthEnd.getDate();
  const cells = [];

  for (let index = 0; index < startWeekday; index += 1) {
    cells.push(null);
  }

  for (let day = 1; day <= totalDays; day += 1) {
    cells.push(new Date(today.getFullYear(), today.getMonth(), day));
  }

  return (
    <section className="panel panel-calendar fade-in">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Calendar</p>
          <h3>{today.toLocaleString("en-US", { month: "long", year: "numeric" })}</h3>
        </div>
        <span className="badge badge-soft">Live project timeline</span>
      </div>

      <div className="calendar-grid calendar-weekdays">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((weekday) => (
          <span key={weekday}>{weekday}</span>
        ))}
      </div>

      <div className="calendar-grid">
        {cells.map((day, index) => {
          if (!day) {
            return <div className="calendar-cell calendar-empty" key={`empty-${index}`} />;
          }

          const meta = getDayMeta(day, projects);
          const isToday = isSameDate(day, today);

          return (
            <div
              className={`calendar-cell ${isToday ? "is-today" : ""} ${meta.highlight}`}
              key={day.toISOString()}
            >
              <span>{day.getDate()}</span>
              {meta.count > 0 ? <small>{meta.count} active</small> : <small>Free</small>}
            </div>
          );
        })}
      </div>
    </section>
  );
}
