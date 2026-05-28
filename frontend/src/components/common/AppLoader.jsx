export default function AppLoader({ label = "Loading workspace..." }) {
  return (
    <div className="loading-screen">
      <div className="loader-card">
        <div className="loader-mark" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <strong>{label}</strong>
      </div>
    </div>
  );
}
