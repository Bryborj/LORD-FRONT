import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import API from "../config";

const VerTickets = () => {
    const [tickets, setTickets] = useState([]);
    const [ticketSeleccionado, setTicketSeleccionado] = useState(null);
    const [fechaFiltro, setFechaFiltro] = useState("");
    const ticketRef = useRef();

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const res = await axios.get(`${API}/api/tickets`, {
                    headers: { Authorization: localStorage.getItem("token") },
                });
                setTickets(res.data);
            } catch (error) {
                console.error("Error al cargar tickets:", error);
            }
        };
        fetchTickets();
    }, []);

    const imprimirTicket = () => {
        const contenido = ticketRef.current.innerHTML;
        const ventana = window.open("", "_blank", "width=600,height=600");
        ventana.document.write(`
    <html>
      <head>
        <title>Ticket de Venta</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h3 { margin-bottom: 10px; }
          ul { margin-top: 10px; }
        </style>
      </head>
      <body>
        ${contenido}
        <script>
          window.onload = function() {
            window.print();
            window.onafterprint = () => window.close();
          }
        </script>
      </body>
    </html>
  `);
        ventana.document.close();
    };

    const ticketsFiltrados = fechaFiltro
        ? tickets.filter(
            (t) => new Date(t.fecha).toISOString().slice(0, 10) === fechaFiltro
        )
        : tickets;

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-6">Tickets de Venta</h2>

            {/* Barra de filtros */}
            <div className="bg-gray-100 p-4 rounded-md shadow mb-6 flex flex-wrap items-end gap-4">
                <div>
                    <label className="block font-semibold mb-1">Filtrar por fecha:</label>
                    <input
                        type="date"
                        value={fechaFiltro}
                        onChange={(e) => setFechaFiltro(e.target.value)}
                        className="p-2 border rounded"
                    />
                </div>
                {fechaFiltro && (
                    <button
                        onClick={() => setFechaFiltro("")}
                        className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
                    >
                        Limpiar filtro
                    </button>
                )}
            </div>

            {/* Lista de tickets */}
            <div className="grid gap-4">
                {ticketsFiltrados.map((ticket, i) => (
                    <div
                        key={i}
                        className="bg-white p-4 rounded shadow hover:cursor-pointer hover:bg-blue-100"
                        onClick={() => setTicketSeleccionado(ticket)}
                    >
                        <p><strong>Fecha:</strong> {new Date(ticket.fecha).toLocaleString()}</p>
                        <p><strong>Total:</strong> ${ticket.total.toFixed(2)}</p>
                    </div>
                ))}
            </div>

            {/* Modal de detalle */}
            {ticketSeleccionado && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md relative" ref={ticketRef}>
                        <button
                            className="absolute top-2 right-2 text-gray-500 hover:text-black"
                            onClick={() => setTicketSeleccionado(null)}
                        >
                            ✕
                        </button>
                        <h3 className="text-xl font-bold mb-2">Detalle del Ticket</h3>
                        <p><strong>Fecha:</strong> {new Date(ticketSeleccionado.fecha).toLocaleString()}</p>
                        <p><strong>Total:</strong> ${ticketSeleccionado.total.toFixed(2)}</p>
                        <div className="mt-4">
                            <h4 className="font-semibold">Productos:</h4>
                            <ul className="list-disc pl-6">
                                {ticketSeleccionado.productos.map((p, idx) => (
                                    <li key={idx}>
                                        {p.nombre} x {p.cantidad} — ${p.precio.toFixed(2)}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <button
                            onClick={imprimirTicket}
                            className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            Imprimir Ticket
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VerTickets;
