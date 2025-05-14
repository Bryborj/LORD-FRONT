import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Dialog } from "@material-tailwind/react";
import API from "../config";

const Modify = () => {
  const [productos, setProductos] = useState([]);
  const [upProduct, setUpProduct] = useState({});
  const [open, setOpen] = useState(false);
  const [openp, setOpenp] = useState(false);
  const [search, setSearch] = useState("");

  const [nombre, setNombre] = useState("");
  const [categoria, setCategoria] = useState("");
  const [precio, setPrecio] = useState("");
  const [unidad_medida, setUnidadMedida] = useState("");
  const [stock_actual, setStockActual] = useState("");

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API}/api/products`, {
        headers: { Authorization: token },
      });
      setProductos(res.data);
    } catch (error) {
      alert("❌ Error al consultar la base de datos");
    }
  };

  const clearForm = () => {
    setNombre("");
    setCategoria("");
    setPrecio("");
    setUnidadMedida("");
    setStockActual("");
    setUpProduct({});
  };

  const openDialogModify = () => {
    setOpen(!open);
    clearForm();
  };

  const openDialogUpdate = () => {
    setOpenp(!openp);
    clearForm();
  };

  const handleAgregar = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const newProduct = {
        nombre,
        categoria,
        precio: parseFloat(parseFloat(precio).toFixed(2)),
        unidad_medida,
        stock_actual,
      };

      await axios.post(`${API}/api/products`, newProduct, {
        headers: { Authorization: token },
      });
      fetchProducts();
      openDialogModify();
    } catch (error) {
      alert("❌ Error al agregar el producto");
    }
  };

  const handleOpenUpdateDialog = (producto) => {
    setUpProduct(producto);
    setNombre(producto.nombre);
    setCategoria(producto.categoria);
    setPrecio(producto.precio);
    setUnidadMedida(producto.unidad_medida);
    setStockActual(producto.stock_actual);
    setOpenp(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const update = {
        nombre,
        categoria,
        precio: parseFloat(parseFloat(precio).toFixed(2)),
        unidad_medida,
        stock_actual,
      };
      await axios.put(`${API}/api/products/${upProduct._id}`, update, {
        headers: { Authorization: token },
      });
      alert("✅ Producto actualizado correctamente");
      setOpenp(false);
      clearForm();
      fetchProducts();
    } catch (error) {
      alert("❌ Ocurrió un error al actualizar el producto");
    }
  };

  const deleteProduct = async (id) => {
    const confirmacion = window.confirm(
      "¿Estás seguro de que deseas eliminar este producto?"
    );
    if (!confirmacion) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API}/api/products/${id}`, {
        headers: { Authorization: token },
      });
      alert("Producto eliminado");
      fetchProducts();
    } catch (error) {
      alert("❌ Error al eliminar producto");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = productos.filter((producto) =>
    producto.nombre.toLowerCase().includes(search.toLowerCase()) ||
    producto.categoria.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4">
      <div className="mt-4 flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Modificar Productos</h1>
        <button
          onClick={openDialogModify}
          className="bg-green-500 text-white px-2 py-0 rounded hover:bg-green-600"
        >
          Nuevo Producto
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar por nombre o categoría"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded w-full"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((producto) => (
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
            <div className="mt-4 flex justify-end gap-2">
              <button
                className="bg-yellow-700 text-white px-3 py-1 rounded hover:bg-yellow-800"
                onClick={() => handleOpenUpdateDialog(producto)}
              >
                Editar
              </button>
              <button
                onClick={() => deleteProduct(producto._id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Dialogo Agregar */}
      <Dialog open={open} handler={openDialogModify}>
        <div className="p-4 bg-white rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-2">Agregar nuevo producto</h3>
          <form>
            <div className="flex flex-col gap-2">
              <label>Nombre:</label>
              <input
                type="text"
                placeholder="Nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
              <label>Categoría:</label>
              <input
                type="text"
                placeholder="Categoría"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                required
              />
              <label>Precio:</label>
              <input
                type="number"
                placeholder="Precio"
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
                required
              />
              <label>Unidad de medida:</label>
              <input
                type="text"
                placeholder="Unidad de medida"
                value={unidad_medida}
                onChange={(e) => setUnidadMedida(e.target.value)}
                required
              />
              <label>Cantidad:</label>
              <input
                type="number"
                placeholder="Stock actual"
                value={stock_actual}
                onChange={(e) => setStockActual(e.target.value)}
                required
              />
            </div>
            <br />
            <div className="justify-between">
              <button
                onClick={handleAgregar}
                className="bg-green-500 text-white mt-2 px-3 py-1 rounded hover:bg-green-600 w-50 h-10"
              >
                Agregar producto
              </button>
              <Button
                onClick={openDialogModify}
                className="bg-red-500 text-white m-2 px-3 py-1 rounded hover:bg-red-600 w-20 h-10"
              >
                Cerrar
              </Button>
            </div>
          </form>
        </div>
      </Dialog>

      {/* Dialogo Actualizar */}
      <Dialog open={openp} handler={openDialogUpdate}>
        <div className="p-4 bg-white rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-2">Actualizar producto</h3>
          <form>
            <div className="flex flex-col gap-2">
              <label>Nombre:</label>
              <input
                type="text"
                placeholder="Nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
              <label>Categoría:</label>
              <input
                type="text"
                placeholder="Categoría"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                required
              />
              <label>Precio:</label>
              <input
                type="number"
                placeholder="Precio"
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
                required
              />
              <label>Unidad de medida:</label>
              <input
                type="text"
                placeholder="Unidad de medida"
                value={unidad_medida}
                onChange={(e) => setUnidadMedida(e.target.value)}
                required
              />
              <label>Cantidad:</label>
              <input
                type="number"
                placeholder="Stock actual"
                value={stock_actual}
                onChange={(e) => setStockActual(e.target.value)}
                required
              />
            </div>
            <br />
            <div className="justify-between">
              <button
                onClick={handleUpdate}
                className="bg-green-500 text-white mt-2 px-3 py-1 rounded hover:bg-green-600 w-50 h-10"
              >
                Actualizar producto
              </button>
              <Button
                onClick={openDialogUpdate}
                className="bg-red-500 text-white m-2 px-3 py-1 rounded hover:bg-red-600 w-20 h-10"
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

export default Modify;
