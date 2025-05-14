import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Dialog } from "@material-tailwind/react";
import API from "../config"

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [upUser, setUpUser] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",  // Añadido campo de contraseña
    position: "empleado",
  });

  // Fetch users from the API
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API}/api/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
    } catch (error) {
      alert("❌ Error al consultar la base de datos");
    }
  };

  // Open and close dialog for adding or updating user
  const toggleDialog = () => {
    setOpenDialog(!openDialog);
    if (openDialog) clearForm();
  };

  // Clear form data
  const clearForm = () => {
    setFormData({
      nombre: "",
      email: "",
      password: "",  // Resetea también el campo de la contraseña
      position: "empleado",
    });
    setUpUser({});
  };

  // Handle form field changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Add new user to the database
  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const { nombre, email, password, position } = formData;
      await axios.post(
        `${API}/api/user/registrar`,
        { nombre, email, password, position },  // Se incluye la contraseña
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchUsers();
      toggleDialog();
    } catch (error) {
      alert("❌ Error al agregar el usuario");
    }
  };

  // Update existing user
  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const { nombre, email, password, position } = formData;
      // Solo enviamos la contraseña si se proporcionó
      const userData = { nombre, email, position };
      if (password) {
        userData.password = password;
      }
      await axios.put(
        `${API}/api/user/${upUser._id}`,
        userData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("✅ Usuario actualizado correctamente");
      fetchUsers();
      toggleDialog();
    } catch (error) {
      alert("❌ Error al actualizar usuario");
    }
  };

  // Delete user
  const deleteUser = async (id) => {
    const confirmation = window.confirm("¿Estás seguro de eliminar este usuario?");
    if (!confirmation) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API}/api/user/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("✅ Usuario eliminado correctamente");
      fetchUsers();
    } catch (error) {
      alert("❌ Error al eliminar usuario");
    }
  };

  // Set user data for update
  const setUserToUpdate = (user) => {
    setUpUser(user);
    setFormData({
      nombre: user.nombre,
      email: user.email,
      password: user.password,  // Dejamos la contraseña en blanco para la edición
      position: user.position,
    });
    toggleDialog();
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-4">
      <div className="mt-4 flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Gestionar Usuarios</h1>
        <button
          onClick={toggleDialog}
          className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
        >
          Nuevo Usuario
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <div key={user._id} className="bg-white shadow-md rounded-lg p-4 border hover:shadow-lg transition">
            <h2 className="text-xl font-semibold">{user.nombre}</h2>
            <p className="text-sm text-gray-500">{user.email}</p>
            <p className="text-sm text-gray-700">Posición: {user.position}</p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                className="bg-yellow-700 text-white px-3 py-1 rounded hover:bg-yellow-800"
                onClick={() => setUserToUpdate(user)}
              >
                Editar
              </button>
              <button
                onClick={() => deleteUser(user._id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Dialog Agregar / Actualizar */}
      <Dialog open={openDialog} handler={toggleDialog}>
        <div className="p-4 bg-white rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-2">{upUser._id ? "Actualizar usuario" : "Agregar nuevo usuario"}</h3>
          <form onSubmit={upUser._id ? handleUpdateUser : handleAddUser}>
            <div className="flex flex-col gap-2">
              <label>Nombre:</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
              />
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <label>Contraseña:</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder={formData.password !== "" ? "Deja en blanco si no quieres cambiarla" : "Contraseña"}
              />
              <label>Posición:</label>
              <select name="position" value={formData.position} onChange={handleChange}>
                <option value="empleado">Empleado</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="submit"
                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
              >
                {upUser._id ? "Actualizar" : "Agregar"}
              </button>
              <Button
                onClick={toggleDialog}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Cerrar
              </Button>
            </div>
          </form>
        </div>
      </Dialog>
    </div>
  );
};

export default ManageUsers;
