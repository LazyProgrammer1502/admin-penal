import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout title="Overview" />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Dashboard />} />
      </Route>

      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout title="Products" />
          </ProtectedRoute>
        }
      >
        <Route path="/products" element={<Products />} />
      </Route>
    </Routes>
  );
}
