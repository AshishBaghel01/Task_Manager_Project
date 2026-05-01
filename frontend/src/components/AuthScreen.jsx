import { useState } from "react";

export default function AuthScreen({
  hasAdmin,
  loginForm,
  signupForm,
  setupForm,
  loading,
  error,
  onLoginChange,
  onSignup,
  onSignupChange,
  onSetupChange,
  onLogin,
  onSetupAdmin,
}) {
  const [mode, setMode] = useState("login");

  return (
    <main className="auth-shell">
      <section className="auth-hero fade-in">
        <div className="hero-badge">Task Manager</div>
        <h1>Smart project tracking for admins and team members.</h1>
        <p>
          Monitor project timelines, progress percentages, overdue work, and team output from a
          clean workspace designed for daily use.
        </p>

        <div className="hero-points">
          <article>
            <strong>Admin control</strong>
            <span>Create projects, assign members, and track completion instantly.</span>
          </article>
          <article>
            <strong>Member clarity</strong>
            <span>Each member sees their assigned work, deadlines, and live progress.</span>
          </article>
          <article>
            <strong>Shared calendar</strong>
            <span>Spot active windows, delivery pressure, and schedule gaps at a glance.</span>
          </article>
        </div>
      </section>

      <section className="auth-panel fade-in">
        <div className="auth-tabs">
          <button className={mode === "login" ? "active" : ""} onClick={() => setMode("login")} type="button">
            Login
          </button>
          <button className={mode === "signup" ? "active" : ""} onClick={() => setMode("signup")} type="button">
            Create Account
          </button>
          {!hasAdmin ? <span>First-time admin setup</span> : null}
        </div>

        {mode === "login" ? (
          <form className="auth-form" onSubmit={onLogin}>
            <div>
              <label htmlFor="login-email">Email</label>
              <input
                id="login-email"
                name="email"
                onChange={onLoginChange}
                placeholder="admin@company.com"
                type="email"
                value={loginForm.email}
              />
            </div>
            <div>
              <label htmlFor="login-password">Password</label>
              <input
                id="login-password"
                name="password"
                onChange={onLoginChange}
                placeholder="Enter password"
                type="password"
                value={loginForm.password}
              />
            </div>
            <button disabled={loading} type="submit">
              {loading ? "Signing in..." : "Login"}
            </button>
          </form>
        ) : (
          <form className="auth-form" onSubmit={onSignup}>
            <div>
              <label htmlFor="signup-name">Full name</label>
              <input
                id="signup-name"
                name="name"
                onChange={onSignupChange}
                placeholder="Your name"
                type="text"
                value={signupForm.name}
              />
            </div>
            <div>
              <label htmlFor="signup-email">Email</label>
              <input
                id="signup-email"
                name="email"
                onChange={onSignupChange}
                placeholder="you@company.com"
                type="email"
                value={signupForm.email}
              />
            </div>
            <div>
              <label htmlFor="signup-password">Password</label>
              <input
                id="signup-password"
                name="password"
                onChange={onSignupChange}
                placeholder="Create password"
                type="password"
                value={signupForm.password}
              />
            </div>
            <button disabled={loading} type="submit">
              {loading ? "Creating..." : "Create member account"}
            </button>
          </form>
        )}

        {!hasAdmin ? (
          <form className="auth-form auth-form-secondary" onSubmit={onSetupAdmin}>
            <div className="section-title-row">
              <h3>Create first admin</h3>
            </div>
            <div>
              <label htmlFor="setup-name">Full name</label>
              <input
                id="setup-name"
                name="name"
                onChange={onSetupChange}
                placeholder="Admin name"
                type="text"
                value={setupForm.name}
              />
            </div>
            <div>
              <label htmlFor="setup-email">Email</label>
              <input
                id="setup-email"
                name="email"
                onChange={onSetupChange}
                placeholder="owner@company.com"
                type="email"
                value={setupForm.email}
              />
            </div>
            <div>
              <label htmlFor="setup-password">Password</label>
              <input
                id="setup-password"
                name="password"
                onChange={onSetupChange}
                placeholder="Create password"
                type="password"
                value={setupForm.password}
              />
            </div>
            <button disabled={loading} type="submit">
              {loading ? "Creating..." : "Create admin account"}
            </button>
          </form>
        ) : null}

        {error ? <p className="form-error">{error}</p> : null}
      </section>
    </main>
  );
}
