import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API from "../config"

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API}/api/auth/login`, {
        email,
        password
      });
      alert(res.data.mensaje);
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err) {
      alert('Error al iniciar sesión');
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>Iniciar sesión</h2>
      <input type="email" placeholder="Correo" value={email} onChange={e => setEmail(e.target.value)} required />
      <br />
      <input type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} required />
      <br />
      <button type="submit">Entrar</button>
    </form>
  );
}

export default Login;
