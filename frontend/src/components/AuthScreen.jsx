import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ShieldCheck, Sparkles } from "lucide-react";
import BorderBeam from "./magic/BorderBeam";

export default function AuthScreen({
  hasAdmin,
  loginForm,
  signupForm,
  setupForm,
  loading,
  error,
  onCreateAdmin,
  onLoginChange,
  onSignup,
  onSignupChange,
  onSetupChange,
  onLogin,
  onSetupAdmin,
}) {
  const [mode, setMode] = useState("login");
  const [adminEnabled, setAdminEnabled] = useState(false);

  return (
    <main className="auth-shell">
      <div className="auth-ambient" aria-hidden="true" />
      <section className="auth-left">
        <motion.div
          className="auth-card"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
        >
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
              onClick={() => {
                setMode("login");
              }}
            >
              Login
            </button>
            <button
              type="button"
              className={mode === "signup" ? "active" : ""}
              onClick={() => {
                setMode("signup");
              }}
            >
              Sign Up
            </button>
            <button
              type="button"
              className={adminEnabled ? "active" : ""}
              onClick={() => {
                setAdminEnabled((current) => !current);
                setMode("login");
              }}
            >
              Admin
            </button>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={`${adminEnabled ? "admin" : "member"}-${mode}-${hasAdmin ? "ready" : "setup"}`}
              initial={{ opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -18 }}
              transition={{ duration: 0.24 }}
            >
          {adminEnabled ? (
            hasAdmin ? (
              mode === "signup" ? (
                <form className="auth-form" onSubmit={onCreateAdmin}>
                  <div className="input-group">
                    <label htmlFor="setup-name">Admin name</label>
                    <input
                      id="setup-name"
                      name="name"
                      onChange={onSetupChange}
                      placeholder="Your name"
                      type="text"
                      value={setupForm.name}
                    />
                  </div>
                  <div className="input-group">
                    <label htmlFor="setup-email">Admin Email Address</label>
                    <input
                      id="setup-email"
                      name="email"
                      onChange={onSetupChange}
                      placeholder="admin@company.com"
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
              ) : (
                <form className="auth-form" onSubmit={(event) => onLogin(event, "admin")}>
                  <div className="input-group">
                    <label htmlFor="login-email">Admin Email Address</label>
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
                    {loading ? "Signing in..." : "Login as admin"}
                  </button>
                </form>
              )
            ) : (
              <form className="auth-form" onSubmit={onSetupAdmin}>
                <div className="input-group">
                  <label htmlFor="setup-name">Admin name</label>
                  <input
                    id="setup-name"
                    name="name"
                    onChange={onSetupChange}
                    placeholder="Your name"
                    type="text"
                    value={setupForm.name}
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="setup-email">Admin Email Address</label>
                  <input
                    id="setup-email"
                    name="email"
                    onChange={onSetupChange}
                    placeholder="admin@company.com"
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
            )
          ) : mode === "signup" ? (
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
          ) : (
            <form className="auth-form" onSubmit={(event) => onLogin(event, "member")}>
              <div className="input-group">
                <label htmlFor="login-email">Email Address</label>
                <input
                  id="login-email"
                  name="email"
                  onChange={onLoginChange}
                  placeholder="you@company.com"
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
          )}
            </motion.div>
          </AnimatePresence>

          <p className="auth-legal">
            By creating an account, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
          </p>

          <p className="auth-toggle-copy">
            {adminEnabled ? (
              hasAdmin ? (
                mode === "login" ? (
                  <>
                    Need another admin? <button type="button" className="link-button" onClick={() => setMode("signup")}>Create Admin</button>
                  </>
                ) : (
                  <>
                    Already have an admin account? <button type="button" className="link-button" onClick={() => setMode("login")}>Login</button>
                  </>
                )
              ) : (
                <>Admin mode is enabled. Create the first admin account above.</>
              )
            ) : mode === "login" ? (
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
        </motion.div>
      </section>

      <motion.aside
        className="auth-right"
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.65, ease: "easeOut" }}
      >
        <BorderBeam />
        <div className="promo-panel">
          <div className="promo-copy">
            <p className="promo-eyebrow">Seamless work experience</p>
            <h2 >Plan, track, and deliver projects faster with a powerful, intuitive workspace built for modern teams.</h2>
            <p>Optimize daily workflows with a sleek experience designed for teams and leaders.</p>
          </div>

          <div className="promo-illustration">
            <motion.div
              className="illustration-card"
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="illustration-top" />
              <div className="illustration-body">
                <div className="illustration-avatar">
                  <ShieldCheck size={28} />
                </div>
                <div className="illustration-laptop">
                  <div className="laptop-screen" />
                  <div className="laptop-base" />
                </div>
              </div>
            </motion.div>
            <motion.div
              className="spark-badge"
              animate={{ rotate: [0, 6, -4, 0], scale: [1, 1.06, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <Sparkles size={18} />
              Live Tasks
            </motion.div>
          </div>

          <div className="promo-dots">
            <span className="dot active" />
            <span className="dot" />
            <span className="dot" />
          </div>
        </div>
      </motion.aside>
    </main>
  );
}
