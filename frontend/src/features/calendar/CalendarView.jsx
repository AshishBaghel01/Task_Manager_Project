import { useState } from "react";
import ProgressBar from "../../components/common/ProgressBar";
import { formatDate, isSameCalendarDate, statusClass } from "../../utils/project";

const calendarYear = 2026;

export default function CalendarView({ isAdmin, projects, user }) {
  const [monthIndex, setMonthIndex] = useState(4);
  const visibleDate = new Date(calendarYear, monthIndex, 1);
  const monthName = visibleDate.toLocaleString("en-US", { month: "long", year: "numeric" });

  function visitPreviousMonth() {
    setMonthIndex((current) => (current === 0 ? 11 : current - 1));
  }

  function visitNextMonth() {
    setMonthIndex((current) => (current === 11 ? 0 : current + 1));
  }

  return (
    <section className="calendar-page">
      <div className="calendar-board">
        <div className="calendar-toolbar">
          <button onClick={visitPreviousMonth} type="button">{"<"}</button>
          <h2>{monthName}</h2>
          <button onClick={visitNextMonth} type="button">{">"}</button>
          <select
            aria-label="Choose month in 2026"
            className="month-select"
            onChange={(event) => setMonthIndex(Number(event.target.value))}
            value={monthIndex}
          >
            {Array.from({ length: 12 }, (_, index) => (
              <option key={index} value={index}>
                {new Date(calendarYear, index, 1).toLocaleString("en-US", { month: "long" })}
              </option>
            ))}
          </select>
          <div className="segmented">
            <button className="active" type="button">Month</button>
            <button type="button">Week</button>
            <button type="button">Day</button>
          </div>
        </div>
        <CalendarGrid monthIndex={monthIndex} projects={projects} year={calendarYear} />
      </div>

      <aside className="calendar-side-panel">
        <h2>{isAdmin ? "Active Projects" : "Your Projects"}</h2>
        <p>{isAdmin ? "Current project windows and progress." : "Timeline of your active engagements."}</p>
        {projects.slice(0, 4).map((project) => {
          const member = project.members.find((item) => item.user.id === user.id);
          return (
            <button key={project.id} type="button">
              <span className={`side-marker ${statusClass(project.status)}`} />
              <strong>{project.name}</strong>
              <small>{formatDate(project.startDate)} - {formatDate(project.endDate)}</small>
              <ProgressBar progress={member?.progress ?? project.overallCompletion} status={project.status} />
            </button>
          );
        })}
        {!isAdmin ? (
          <div className="focus-card">
            <h3>Weekly Focus</h3>
            <p>Finish the highest-priority assigned task and update your progress before TimeLine.</p>
          </div>
        ) : null}
      </aside>
    </section>
  );
}

function CalendarGrid({ monthIndex, projects, year }) {
  const monthStart = new Date(year, monthIndex, 1);
  const monthEnd = new Date(year, monthIndex + 1, 0);
  const leadingDays = monthStart.getDay();
  const totalDays = monthEnd.getDate();
  const visibleCells = Math.ceil((leadingDays + totalDays) / 7) * 7;
  const days = Array.from({ length: visibleCells }, (_, index) => {
    const dayNumber = index - leadingDays + 1;
    return new Date(year, monthIndex, dayNumber);
  });
  const labels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="large-calendar">
      {labels.map((label) => <strong key={label}>{label}</strong>)}
      {days.map((day) => {
        const isOutsideMonth = day.getMonth() !== monthIndex;
        const startMatches = projects.filter((project) => isSameCalendarDate(day, new Date(project.startDate)));
        const endMatches = projects.filter((project) => isSameCalendarDate(day, new Date(project.endDate)));
        const cellClass = [
          isOutsideMonth ? "muted-day" : "",
          startMatches.length ? "project-start-day" : "",
          endMatches.length ? "project-end-day" : "",
        ]
          .filter(Boolean)
          .join(" ");

        return (
          <div className={cellClass} key={day.toISOString()}>
            <span>{day.getDate()}</span>
            {startMatches.slice(0, 1).map((project) => (
              <small className="date-chip start-chip" key={`start-${project.id}`}>
                Start: {project.name.slice(0, 12)}
              </small>
            ))}
            {endMatches.slice(0, 1).map((project) => (
              <small className="date-chip end-chip" key={`end-${project.id}`}>
                End: {project.name.slice(0, 12)}
              </small>
            ))}
          </div>
        );
      })}
    </div>
  );
}
