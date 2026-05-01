export default function StatCard({ label, value, accent, detail }) {
  return (
    <article className={`stat-card ${accent} fade-in`}>
      <p>{label}</p>
      <strong>{value}</strong>
      <span>{detail}</span>
    </article>
  );
}
