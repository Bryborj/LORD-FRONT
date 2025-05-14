import React, { useEffect, useState } from "react";
import axios from "axios";
import API from "../config";

const RegistroVentas = () => {
  const [ventas, setVentas] = useState([]);
  const [ventasFiltradas, setVentasFiltradas] = useState([]);
  const [productos, setProductos] = useState([]);
  const [filtroProducto, setFiltroProducto] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const [ventasRes, productosRes] = await Promise.all([
          axios.get(`${API}/api/ventas`, {
            headers: { Authorization: token },
          }),
          axios.get(`${API}/api/products`, {
            headers: { Authorization: token },
          }),
        ]);

        setVentas(ventasRes.data);
        setVentasFiltradas(ventasRes.data);
        setProductos(productosRes.data);
      } catch (error) {
        console.error("Error cargando datos:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const filtrarVentas = () => {
      let resultado = [...ventas];

      if (filtroProducto) {
        resultado = resultado.filter(v => v.producto?._id === filtroProducto);
      }

      if (fechaInicio) {
        resultado = resultado.filter(v => new Date(v.fecha) >= new Date(fechaInicio));
      }

      if (fechaFin) {
        resultado = resultado.filter(v => new Date(v.fecha) <= new Date(fechaFin));
      }

      setVentasFiltradas(resultado);
    };

    filtrarVentas();
  }, [filtroProducto, fechaInicio, fechaFin, ventas]);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Registro de Ventas</h2>

      {/* Filtros */}
      <div className="bg-white rounded p-4 shadow mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block mb-1 font-semibold">Producto</label>
          <select
            className="w-full p-2 border rounded"
            value={filtroProducto}
            onChange={(e) => setFiltroProducto(e.target.value)}
          >
            <option value="">-- Todos --</option>
            {productos.map((p) => (
              <option key={p._id} value={p._id}>{p.nombre}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1 font-semibold">Desde</label>
          <input
            type="date"
            className="w-full p-2 border rounded"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Hasta</label>
          <input
            type="date"
            className="w-full p-2 border rounded"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
          />
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 table-auto">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="px-4 py-2">Producto</th>
              <th className="px-4 py-2">Cantidad</th>
              <th className="px-4 py-2">Precio</th>
              <th className="px-4 py-2">Total</th>
              <th className="px-4 py-2">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {ventasFiltradas.map((v) => (
              <tr key={v._id} className="text-center border-b">
                <td className="px-4 py-2">{v.producto?.nombre || "Desconocido"}</td>
                <td className="px-4 py-2">{v.cantidad_vendida}</td>
                <td className="px-4 py-2">${v.producto?.precio.toFixed(2)}</td>
                <td className="px-4 py-2">
                  ${(v.cantidad_vendida * v.producto?.precio).toFixed(2)}
                </td>
                <td className="px-4 py-2">{new Date(v.fecha).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RegistroVentas;
