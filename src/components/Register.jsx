import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API from "../config"

function Register() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/api/auth/register`, {
        nombre,
        email,
        password
      });
      alert('Usuario registrado correctamente');
      navigate('/');
    } catch (err) {
      alert('Error al registrar');
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <h2>Registro de usuario</h2>
      <input type="text" placeholder="Nombre" value={nombre} onChange={e => setNombre(e.target.value)} required />
      <br />
      <input type="email" placeholder="Correo" value={email} onChange={e => setEmail(e.target.value)} required />
      <br />
      <input type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} required />
      <br />
      <button type="submit">Registrarse</button>
    </form>
  );
}

export default Register;
