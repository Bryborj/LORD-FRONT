import React, { useState } from "react";
import axios from "axios";
import API from "../config";

const RegistrarUsuario = () => {
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    contraseña: "",
    rol: "empleado", // valor por defecto
  });
  const [mensaje, setMensaje] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    try {
      const res = await axios.post(`${API}/api/user/registrar`, form, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      setMensaje(res.data.message || "✅ Usuario registrado con éxito.");
      setForm({ nombre: "", email: "", contraseña: "", rol: "empleado" });
    } catch (error) {
      console.error(error);
      setMensaje(
        error.response?.data?.message || "❌ Error al registrar el usuario."
      );
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Registrar Usuario</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full border p-2 rounded"
          type="text"
          name="nombre"
          placeholder="Nombre completo"
          value={form.nombre}
          onChange={handleChange}
          required
        />
        <input
          className="w-full border p-2 rounded"
          type="email"
          name="email"
          placeholder="Correo electrónico"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          className="w-full border p-2 rounded"
          type="password"
          name="contraseña"
          placeholder="Contraseña"
          value={form.contraseña}
          onChange={handleChange}
          required
        />
        <select
          className="w-full border p-2 rounded"
          name="rol"
          value={form.rol}
          onChange={handleChange}
        >
          <option value="empleado">Empleado</option>
          <option value="admin">Administrador</option>
        </select>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Registrar
        </button>
      </form>
      {mensaje && <p className="mt-4 text-sm">{mensaje}</p>}
    </div>
  );
};

export default RegistrarUsuario;
