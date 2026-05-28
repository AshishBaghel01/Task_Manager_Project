import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "./context/AppProvider";
import { ProtectedRoute } from "./components/ProtectedRoute";
import AuthLayout from "./layouts/AuthLayout";
import AppLayout from "./layouts/AppLayout";

function App() {
  return (
    <Router>
      <AppProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/auth" element={<AuthLayout />} />
          
          {/* Protected app routes */}
          <Route
            path="/app/*"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          />
          
          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/app/dashboard" replace />} />
        </Routes>
      </AppProvider>
    </Router>
  );
}

export default App;
