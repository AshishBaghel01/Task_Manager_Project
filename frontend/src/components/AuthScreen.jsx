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
      <section className="auth-left">
        <div className="auth-card">
          <div className="auth-brand">
            <div className="brand-mark">TM</div>
            <div>
              <p className="brand-label">Task Manager</p>
            </div>
          </div>

          <div className="auth-heading">
            <h1>Welcome Back !</h1>
            <p className="auth-intro">Please enter your details</p>
          </div>

          <div className="auth-mode-switch">
            <button
              type="button"
              className={mode === "login" ? "active" : ""}
              onClick={() => setMode("login")}
            >
              Login
            </button>
            <button
              type="button"
              className={mode === "signup" ? "active" : ""}
              onClick={() => setMode("signup")}
            >
              Sign Up
            </button>
          </div>

          {mode === "login" ? (
            <form className="auth-form" onSubmit={onLogin}>
              <div className="input-group">
                <label htmlFor="login-email">Email Address</label>
                <input
                  id="login-email"
                  name="email"
                  onChange={onLoginChange}
                  placeholder="admin@company.com"
                  type="email"
                  value={loginForm.email}
                />
              </div>

              <div className="input-group">
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
              <div className="input-group">
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
              <div className="input-group">
                <label htmlFor="signup-email">Email Address</label>
                <input
                  id="signup-email"
                  name="email"
                  onChange={onSignupChange}
                  placeholder="you@company.com"
                  type="email"
                  value={signupForm.email}
                />
              </div>
              <div className="input-group">
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

          <p className="auth-legal">
            By creating an account, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
          </p>

          <p className="auth-toggle-copy">
            {mode === "login" ? (
              <>
                Don&apos;t have an account? <button type="button" className="link-button" onClick={() => setMode("signup")}>Sign Up</button>
              </>
            ) : (
              <>
                Already have an account? <button type="button" className="link-button" onClick={() => setMode("login")}>Login</button>
              </>
            )}
          </p>

          {error ? <p className="form-error">{error}</p> : null}
        </div>

        {!hasAdmin ? (
          <div className="admin-setup-card">
            <div className="section-title-row">
              <h3>First-time admin setup</h3>
            </div>
            <form className="auth-form auth-form-secondary" onSubmit={onSetupAdmin}>
              <div className="input-group">
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
              <div className="input-group">
                <label htmlFor="setup-email">Email Address</label>
                <input
                  id="setup-email"
                  name="email"
                  onChange={onSetupChange}
                  placeholder="owner@company.com"
                  type="email"
                  value={setupForm.email}
                />
              </div>
              <div className="input-group">
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
          </div>
        ) : null}
      </section>

      <aside className="auth-right">
        <div className="promo-panel">
          <div className="promo-copy">
            <p className="promo-eyebrow">Seamless work experience</p>
            <h2>Plan, track, and deliver projects faster with a powerful, intuitive workspace built for modern teams.</h2>
            <p>Optimize daily workflows with a sleek experience designed for teams and leaders.</p>
          </div>

          <div className="promo-illustration">
            <div className="illustration-card">
              <div className="illustration-top" />
              <div className="illustration-body">
                <div className="illustration-avatar" />
                <div className="illustration-laptop">
                  <div className="laptop-screen" />
                  <div className="laptop-base" />
                </div>
              </div>
            </div>
          </div>

          <div className="promo-dots">
            <span className="dot active" />
            <span className="dot" />
            <span className="dot" />
          </div>
        </div>
      </aside>
    </main>
  );
}
