import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { CheckCircleIcon, ExclamationCircleIcon } from "@heroicons/react/24/solid";
import API from "../config"

const Login = ({ setAutenticado }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [tipoMensaje, setTipoMensaje] = useState(''); // 'success' o 'error'
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const iniciarSesion = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${API}/api/auth/login`, {
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      setMensaje("✅ Sesión iniciada correctamente.");
      setTipoMensaje("success");
      setAutenticado(true);
      setTimeout(() => {
        navigate("/ventas");
      }, 500);
    } catch (error) {
      console.error(error);
      setMensaje("❌ Error al iniciar sesión. Verifica tus credenciales.");
      setTipoMensaje("error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (mensaje) {
      const timer = setTimeout(() => setMensaje(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [mensaje]);

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-cyan-600 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm animate-fade-in">
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-6">Iniciar Sesión</h2>

        <form onSubmit={iniciarSesion} className="space-y-4">
          <input
            type="email"
            placeholder="Correo electrónico"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Contraseña"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg flex justify-center items-center transition"
            disabled={loading}
          >
            {loading ? (
              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "Iniciar Sesión"
            )}
          </button>
        </form>

        {mensaje && (
          <div
            className={`mt-4 flex items-center justify-center space-x-2 text-sm ${
              tipoMensaje === "success" ? "text-green-600" : "text-red-600"
            }`}
          >
            {tipoMensaje === "success" ? (
              <CheckCircleIcon className="h-5 w-5" />
            ) : (
              <ExclamationCircleIcon className="h-5 w-5" />
            )}
            <span>{mensaje}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
