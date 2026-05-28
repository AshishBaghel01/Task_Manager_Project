export default function AnimatedGridPattern({ variant = "light" }) {
  return (
    <div className={`magic-grid ${variant}`} aria-hidden="true">
      <span />
      <span />
      <span />
    </div>
  );
}
