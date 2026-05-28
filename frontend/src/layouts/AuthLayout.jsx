import { Navigate } from "react-router-dom";
import AuthScreen from "../components/AuthScreen";
import AppLoader from "../components/common/AppLoader";
import { useAppContext } from "../hooks/useAppContext";

export default function AuthLayout() {
  const {
    bootstrapLoading,
    error,
    handleCreateAdmin,
    handleLogin,
    handleSetupAdmin,
    handleSignup,
    hasAdmin,
    loading,
    loginForm,
    setLoginForm,
    setSetupForm,
    setSignupForm,
    setupForm,
    signupForm,
    successMessage,
    token,
    user,
  } = useAppContext();

  // Redirect to app if already authenticated
  if (token && user && !bootstrapLoading) {
    return <Navigate to="/app/dashboard" replace />;
  }

  if (bootstrapLoading) {
    return <AppLoader />;
  }

  return (
    <AuthScreen
      error={error}
      hasAdmin={hasAdmin}
      loading={loading}
      loginForm={loginForm}
      signupForm={signupForm}
      onCreateAdmin={handleCreateAdmin}
      onLogin={handleLogin}
      onLoginChange={(event) => setLoginForm({ ...loginForm, [event.target.name]: event.target.value })}
      onSignup={handleSignup}
      onSignupChange={(event) => setSignupForm({ ...signupForm, [event.target.name]: event.target.value })}
      onSetupAdmin={handleSetupAdmin}
      onSetupChange={(event) => setSetupForm({ ...setupForm, [event.target.name]: event.target.value })}
      setupForm={setupForm}
      successMessage={successMessage}
    />
  );
}
