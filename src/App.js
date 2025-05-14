import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Ventas from "./pages/Ventas";
import Productos from "./pages/Productos";
import Empleados from "./pages/GestionUsuarios";
import Modify from "./pages/Modify";
import RegistroVentas from "./pages/RegistroVentas";
import VerTickets from "./pages/Tickets";
import Prediccion from "./components/prediccion";
import axios from "axios";
import DashboardLayout from "./components/DashboardLayout";
import API from "./config";

// Ruta protegida
const PrivateRoute = ({ autenticado, children }) =>
  autenticado ? children : <Navigate to="/login" />;

function App() {
  const [autenticado, setAutenticado] = useState(false);
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setAutenticado(!!token);

    const fetchUser = async (retries = 3) => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`${API}/api/user/me`, {
          headers: { Authorization: token },
        });
        setUsuario(res.data);
      } catch (error) {
        if (retries > 0) {
          setTimeout(() => fetchUser(retries - 1), 1000); // Reintenta en 1 segundo
        } else {
          setUsuario(null);
          setAutenticado(false);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setAutenticado(false);
    setUsuario(null);
  };

  if (loading) {
    return <p style={{ textAlign: "center", marginTop: "2rem" }}>Cargando...</p>;
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={<Login setAutenticado={setAutenticado} />}
        />
        <Route
          path="/*"
          element={
            <PrivateRoute autenticado={autenticado}>
              <DashboardLayout onLogout={handleLogout}>
                <Routes>
                  <Route path="/ventas" element={<Ventas />} />
                  <Route path="/productos" element={<Productos />} />
                  {usuario?.position === "admin" && (
                    <>
                      <Route path="/empleados" element={<Empleados />} />
                      <Route path="/reportes" element={<Prediccion />} />
                      <Route
                        path="/registro-ventas"
                        element={<RegistroVentas />}
                      />
                      <Route path="/tickets" element={<VerTickets />} />
                      <Route path="/modify" element={<Modify />} />
                    </>
                  )}
                  <Route path="*" element={<Navigate to="/ventas" />} />
                </Routes>
              </DashboardLayout>
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
