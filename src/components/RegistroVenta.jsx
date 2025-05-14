import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API from "../config"

function RegistroVenta() {
  const [productos, setProductos] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState('');
  const [cantidadVendida, setCantidadVendida] = useState('');

  const obtenerProductos = async () => {
    const token = localStorage.getItem('token');
    const res = await axios.get(`${API}/api/products`, {
      headers: { Authorization: token }
    });
    setProductos(res.data);
  };

  useEffect(() => {
    obtenerProductos();
  }, []);

  const registrarVenta = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const nuevaVenta = {
        producto: productoSeleccionado,
        cantidad_vendida: parseInt(cantidadVendida),
        fecha: new Date()
      };

      await axios.post(`${API}/api/ventas`, nuevaVenta, {
        headers: { Authorization: token }
      });

      alert('✅ Venta registrada correctamente');
      setProductoSeleccionado('');
      setCantidadVendida('');
    } catch (err) {
      alert('❌ Error al registrar venta');
    }
  };

  return (
    <form onSubmit={registrarVenta}>
      <h3>Registrar venta</h3>
      <select
        value={productoSeleccionado}
        onChange={(e) => setProductoSeleccionado(e.target.value)}
        required
      >
        <option value="">Selecciona un producto</option>
        {productos.map((p) => (
          <option key={p._id} value={p._id}>
            {p.nombre}
          </option>
        ))}
      </select>
      <input
        type="number"
        placeholder="Cantidad vendida"
        value={cantidadVendida}
        onChange={(e) => setCantidadVendida(e.target.value)}
        required
      />
      <br />
      <button type="submit">Registrar venta</button>
    </form>
  );
}

export default RegistroVenta;
