import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Drawer, IconButton, Typography } from "@material-tailwind/react";
import { Bars3Icon } from "@heroicons/react/24/outline";
import API from "../config";

const Sidebar = ({ onLogout }) => {
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);

  const toggleDrawer = () => setOpen(!open);

  useEffect(() => {
    const getUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await axios.get(`${API}/api/user/me`, {
          headers: {
            Authorization: token,
          },
        });
        setUser(res.data);
      } catch (error) {
        console.error("Error al obtener el usuario:", error);
        setUser(null);
      }
    };

    getUser();
  }, []);

  const Logo = () =>
    !logoError ? (
      <img
        src="/logo-lord-1.png" // ajusta la ruta si el logo está en `public/`
        alt="Logo LORD"
        onError={() => setLogoError(true)}
        className="h-24 mx-auto mb-2 object-contain"
        style={{
          filter: "drop-shadow(2px 2px 4px white",
        }}
      />
    ) : (
      <h1 className="text-xl font-extrabold text-center">
        LORD - INVENTARIO INTELIGENTE
      </h1>
    );

  return (
    <>
      {/* Botón menú hamburguesa en móviles */}
      <div className="md:hidden p-2 ">
        <IconButton
          onClick={toggleDrawer}
          variant="text"
          className="text-cyan-500"
        >
          <Bars3Icon className="h-6 w-6" />
        </IconButton>
      </div>

      {/* Sidebar fijo en pantallas grandes */}
      <div className="hidden md:flex md:flex-col md:w-64 h-screen bg-gradient-to-br from-blue-800 via-purple-800 to-cyan-600 text-white shadow-lg">
        <div className="p-4 border-b border-white/20">
          <Logo />
          <Typography
            variant="small"
            className="text-white/80 mt-1 text-center"
          >
            {user ? `Bienvenido, ${user.nombre}` : "Cargando usuario..."}
          </Typography>
        </div>
        <nav className="flex flex-col p-4 space-y-3 text-white font-medium">
          <SidebarLink to="/" label="Punto de Venta" />
          <SidebarLink to="/productos" label="Productos" />
          {user?.position === "admin" && (
            <>
              <hr className="border-white/30 my-2" />
              <p className="uppercase text-xs text-white/60">Administración</p>
              <SidebarLink to="/registro-ventas" label="Gestión de Ventas" />
              <SidebarLink to="/tickets" label="Gestión de Tickets" />
              <SidebarLink to="/modify" label="Gestión de productos" />
              <SidebarLink to="/empleados" label="Gestión de Empleados" />
              <SidebarLink to="/reportes" label="Reportes" />
            </>
          )}
          <hr className="border-white/30 my-2" />
          <button
            onClick={onLogout}
            className="mt-auto mx-4 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded transition"
          >
            Cerrar sesión
          </button>
        </nav>
      </div>

      {/* Drawer lateral para móviles */}
      <Drawer
        open={open}
        onClose={toggleDrawer}
        className="bg-gradient-to-br from-blue-800 via-purple-800 to-cyan-600 text-white p-4"
      >
        <div className="flex flex-col items-center mb-4">
          <Logo />
          <Typography
            variant="small"
            className="text-white/80 mb-2 text-center"
          >
            {user ? `Bienvenido, ${user.nombre}` : "Cargando usuario..."}
          </Typography>
        </div>
        <nav className="flex flex-col space-y-3 font-medium">
          <SidebarLink to="/" label="Punto de Venta" onClick={toggleDrawer} />
          <SidebarLink
            to="/productos"
            label="Productos"
            onClick={toggleDrawer}
          />
          {user?.position === "admin" && (
            <>
              <hr className="border-white/30 my-2" />
              <p className="uppercase text-xs text-white/60">Administración</p>
              <SidebarLink
                to="/registro-ventas"
                label="Gestión de Ventas"
                onClick={toggleDrawer}
              />
              <SidebarLink
                to="/tickets"
                label="Gestión de Tickets"
                onClick={toggleDrawer}
              />
              <SidebarLink
                to="/modify"
                label="Gestión de productos"
                onClick={toggleDrawer}
              />
              <SidebarLink
                to="/empleados"
                label="Gestión de Empleados"
                onClick={toggleDrawer}
              />
              <SidebarLink
                to="/reportes"
                label="Reportes"
                onClick={toggleDrawer}
              />
            </>
          )}
          <hr className="border-white/30 my-2" />
          <button
            onClick={() => {
              toggleDrawer();
              onLogout();
            }}
            className="mt-4 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded transition"
          >
            Cerrar sesión
          </button>
        </nav>
      </Drawer>
    </>
  );
};

const SidebarLink = ({ to, label, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className="hover:bg-white/10 px-3 py-2 rounded transition duration-200"
  >
    {label}
  </Link>
);

export default Sidebar;
