import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
} from "recharts";
import API from "../config"


const PrediccionComponent = () => {
    const [productos, setProductos] = useState([]);
    const [productoId, setProductoId] = useState("");
    const [ventasDelProducto, setVentasDelProducto] = useState([]);
    const [prediccion, setPrediccion] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [datosGrafica, setDatosGrafica] = useState([]);

    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const res = await axios.get(`${API}/api/products`);
                setProductos(res.data);
            } catch (err) {
                console.error("Error al cargar productos", err);
                setError("No se pudieron cargar los productos.");
            }
        };

        fetchProductos();
    }, []);

    const handleProductoChange = async (e) => {
        const idProducto = e.target.value;
        setProductoId(idProducto);
        setPrediccion(null);
        setError("");

        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(`${API}/api/ventas`, {
                headers: { Authorization: token },
            });

            const ventas = res.data;
            const filtradas = ventas.filter((v) => v.producto?._id === idProducto);
            const cantidades = filtradas.map((v) => v.cantidad_vendida);

            setVentasDelProducto(cantidades);
            const datosVentas = cantidades.map((cantidad, index) => ({
                periodo: `Período ${index + 1}`,
                cantidad,
            }))
            setDatosGrafica(datosVentas);
        } catch (err) {
            console.error("Error al obtener ventas del producto", err);
            setError("No se pudieron obtener las ventas del producto.");
            setVentasDelProducto([]);
        }
    };

    const handleSubmit = async () => {
        setError("");
        setPrediccion(null);

        if (!productoId) {
            return setError("Por favor, selecciona un producto.");
        }

        if (ventasDelProducto.length < 2) {
            return setError("El producto necesita al menos 2 ventas registradas.");
        }

        setLoading(true);

        try {
            const res = await axios.post(`${API}/api/prediccion`, {
                producto: productoId,
                ventas: ventasDelProducto,
            });

            setPrediccion(res.data.prediccion);
            setDatosGrafica(prev => [
                ...prev, {
                    periodo: `Predicción`,
                    cantidad: res.data.prediccion,
                },
            ]);
        } catch (err) {
            console.error("Error al obtener la predicción", err);
            setError("Hubo un error al generar la predicción.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-xl">
            <h2 className="text-2xl font-bold mb-4">📈 Predicción de Demanda</h2>

            <div className="mb-4">
                <label className="block font-semibold mb-1">Selecciona un producto:</label>
                <select
                    value={productoId}
                    onChange={handleProductoChange}
                    className="w-full p-2 border rounded"
                >
                    <option value="">-- Elige un producto --</option>
                    {productos.map((p) => (
                        <option key={p._id} value={p._id}>
                            {p.nombre}
                        </option>
                    ))}
                </select>
            </div>

            <button
                onClick={handleSubmit}
                disabled={loading || !productoId}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
                {loading ? "⏳ Generando..." : "🔍 Obtener Predicción"}
            </button>

            {datosGrafica.length > 0 && (
                <div className="mt-6">
                    <h3 className="font-semibold mb-2">Gráfica de Ventas y Predicción</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={datosGrafica}>
                            <CartesianGrid stroke="#ccc" />
                            <XAxis dataKey="periodo" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="cantidad" stroke="#8884d8" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            )}


            {ventasDelProducto.length > 0 && (
                <p className="mt-3 text-sm text-gray-600">
                    Ventas del producto: [{ventasDelProducto.join(", ")}]
                </p>
            )}

            {error && <p className="text-red-600 mt-3">{error}</p>}

            {prediccion !== null && (
                <div className="mt-4 text-green-700 font-semibold">
                    📊 Predicción de Demanda: {prediccion}
                </div>
            )}
        </div>
    );
};

export default PrediccionComponent;
