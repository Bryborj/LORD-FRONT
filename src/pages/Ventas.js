import React, { useState, useEffect } from "react";
import axios from "axios";
import API from "../config";

const Ventas = () => {
  const [productos, setProductos] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState("");
  const [cantidad, setCantidad] = useState(1);
  const [carrito, setCarrito] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [ventaReciente, setVentaReciente] = useState(null);

  useEffect(() => {
    axios
      .get(`${API}/api/products`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((res) => setProductos(res.data))
      .catch((err) => console.error(err));
  }, []);

  const agregarAlCarrito = () => {
    if (!productoSeleccionado || cantidad < 1) {
      setMensaje("Selecciona un producto válido y una cantidad.");
      return;
    }

    const producto = productos.find((p) => p._id === productoSeleccionado);
    const existe = carrito.find((p) => p._id === productoSeleccionado);

    if (existe) {
      // Actualizar cantidad si ya existe en el carrito
      const actualizado = carrito.map((p) =>
        p._id === productoSeleccionado
          ? { ...p, cantidad: p.cantidad + parseInt(cantidad) }
          : p
      );
      setCarrito(actualizado);
    } else {
      setCarrito([...carrito, { ...producto, cantidad: parseInt(cantidad) }]);
    }

    setProductoSeleccionado("");
    setCantidad(1);
    setMensaje("");
  };

  const eliminarDelCarrito = (id) => {
    setCarrito(carrito.filter((item) => item._id !== id));
  };

  const calcularTotal = () => {
    return carrito
      .reduce((sum, item) => sum + item.precio * item.cantidad, 0)
      .toFixed(2);
  };

  const registrarVenta = async () => {
    if (carrito.length === 0) {
      setMensaje("Agrega productos al carrito primero.");
      return;
    }

    try {
      const ventasPayload = carrito.map((item) => ({
        producto: item._id,
        cantidad_vendida: item.cantidad,
      }));

      // Nueva ruta que valida TODO antes de registrar ventas
      await axios.post(
        `${API}/api/ventas/carrito`,
        { ventas: ventasPayload },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );

      // Crear el ticket global de la venta
      await axios.post(
        `${API}/api/tickets`,
        {
          productos: carrito.map((p) => ({
            nombre: p.nombre,
            precio: p.precio,
            cantidad: p.cantidad,
          })),
          total: calcularTotal(),
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );

      setVentaReciente({
        productos: carrito,
        total: calcularTotal(),
        fecha: new Date().toLocaleString(),
      });

      setMensaje("✅ Venta registrada con éxito.");
      setCarrito([]);
    } catch (error) {
      console.error(error);

      const mensajeBackend = error?.response?.data?.mensaje;

      if (mensajeBackend?.includes("Stock insuficiente para")) {
        setMensaje(`⚠️ ${mensajeBackend}`);
        return;
      }

      setMensaje("❌ Error al registrar la venta.");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Punto de Venta</h2>
      <div className="bg-white p-6 rounded shadow-md w-full max-w-xl">
        <label className="block mb-2 font-semibold">Producto:</label>
        <select
          className="w-full p-2 border rounded mb-4"
          value={productoSeleccionado}
          onChange={(e) => setProductoSeleccionado(e.target.value)}
        >
          <option value="">-- Selecciona un producto --</option>
          {productos.map((prod) => (
            <option key={prod._id} value={prod._id}>
              {prod.nombre} - ${prod.precio}
            </option>
          ))}
        </select>

        <label className="block mb-2 font-semibold">Cantidad:</label>
        <input
          type="number"
          className="w-full p-2 border rounded mb-4"
          value={cantidad}
          min="1"
          onChange={(e) => setCantidad(e.target.value)}
        />

        <button
          className="bg-cyan-700 text-white px-4 py-2 rounded hover:bg-cyan-800 w-full"
          onClick={agregarAlCarrito}
        >
          Agregar al carrito
        </button>

        <h3 className="text-xl font-semibold mt-6 mb-2">Carrito de ventas</h3>
        <ul className="mb-4">
          {carrito.map((item) => (
            <li key={item._id} className="flex justify-between mb-2">
              <span>
                {item.nombre} x {item.cantidad} = $
                {(item.precio * item.cantidad).toFixed(2)}
              </span>
              <button
                className="text-red-600 hover:underline"
                onClick={() => eliminarDelCarrito(item._id)}
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>

        <div className="text-right font-bold text-lg mb-4">
          Total: ${calcularTotal()}
        </div>

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
          onClick={registrarVenta}
        >
          Confirmar Venta
        </button>
        {ventaReciente && (
          <div className="printable">
            <div className="mt-6 border border-gray-300 p-4 rounded bg-white shadow-md">
              <h3 className="text-lg font-bold mb-2">🧾 Ticket de compra</h3>
              <p className="text-sm">Fecha: {ventaReciente.fecha}</p>
              <ul className="text-sm mt-2">
                {ventaReciente.productos.map((item, idx) => (
                  <li key={idx} className="flex justify-between">
                    <span>
                      {item.nombre} x {item.cantidad}
                    </span>
                    <span>${(item.precio * item.cantidad).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
              <hr className="my-2" />
              <p className="font-bold text-right">
                Total: ${ventaReciente.total}
              </p>
              <button
                onClick={() => window.print()}
                className="mt-3 w-full bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
              >
                Imprimir ticket
              </button>
            </div>
          </div>
        )}

        {mensaje && <p className="mt-4 text-sm">{mensaje}</p>}
      </div>
    </div>
  );
};

export default Ventas;
