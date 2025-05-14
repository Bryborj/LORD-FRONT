import React, { useState, useEffect } from "react";
import axios from "axios";
import API from "../config";

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API}/api/products`, {
        headers: {
            Authorization: token
        }
      });
      setProductos(res.data);
    } catch (error) {
      alert("❌ Error al consultar la base de datos");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Productos</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {productos.map((producto) => (
          <div
            key={producto._id}
            className="bg-white shadow-md rounded-lg p-4 border hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold">{producto.nombre}</h2>
            <p className="text-sm text-gray-500">{producto.categoria}</p>
            <p className="text-lg font-bold text-blue-600 mt-2">
              ${producto.precio} USD
            </p>
            <p className="text-sm text-gray-700">
              Stock: {producto.stock_actual} {producto.unidad_medida}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Productos;
