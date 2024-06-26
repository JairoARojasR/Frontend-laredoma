import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import React, { createContext, useState, useEffect } from "react";
import Login from "./pages/Login";
import MainLayout from "./components/MainLayout";
import AgregarEmpleado from "./pages/AgregarEmpleado";
import Productlist from "./pages/Productlist";
import DetalleProducto from "./pages/DetalleProducto";
 import Userlist from "./pages/Userlist";
 import Categorialist from "./pages/Categorialist";
 import Marcaautolist from "./pages/Marcaautolist";
 import Serviciosmantreplist from "./pages/Serviciosmantreplist";
 import Agregarproducto from "./pages/Agregarproducto";
 import AgregarProveedor from "./pages/AgregarProveedor";
 import AgregarVenta from "./pages/AgregarVenta";
 import VentaList from "./pages/Ventalist";
 import ResumenVentas from "./pages/ResumenVentas";
 import ConfirmacionUsuario from "./pages/ConfirmacionUsuario";
 import LoginFormp from "./components/LoginFormp";
 import ViewProfile from './pages/viewProfile';
 import ViewNotf from './pages/notificacioneslist.js';
 import OTPInput from "./pages/OTPInput";
 import Recovered from "./pages/Recovered";
 import Reset from "./pages/Reset";
 import ViewEmpleado from "./pages/VerEmpleado.js"
 import Empleadolist from "./pages/Empleadolist";
 import Rollist from "./pages/Rollist.js";
 import Proveedoreslist from "./pages/Proveedoreslist.js";
 import DetalleVenta from "./pages/DetalleVenta.js";
 import verProveedor from "./pages/VerProveedor.js";
 import ViewProveedor from "./pages/VerProveedor.js"
 import ViewCliente from "./pages/VerCliente.js"

export const RecoveryContext = createContext();

function App() {
   const [page, setPage] = useState("loginFormp");
   const [email, setEmail] = useState();
  const [otp, setOTP] = useState();

  function NavigateComponents() {
  if (page === "otp") return <OTPInput />;
    if (page === "reset") return <Reset />;
    return <Recovered />;
   }

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    const storedOTP = localStorage.getItem("otp");
    if (storedEmail && storedOTP) {
      setEmail(storedEmail);
      setOTP(storedOTP);
    }
  }, []);

  return (
    <RecoveryContext.Provider
    value={{ page, setPage, otp, setOTP, setEmail, email }}
    >
      <Router>
        <div>
          <Routes>
           {/* login */}
           <Route
              path="/usuario/confirmar/:token"
              element={<ConfirmacionUsuario />}
            />
            <Route path="/confirmar-codigo" element={<OTPInput />} />
            <Route path="/nueva-contrasenia" element={<Reset />} />
            <Route path="/contrasenia-recuperada" element={<Recovered />} />
            <Route path="/" element={<Login />} />


            {/* admin */}

            <Route path="/admin" element={<MainLayout />}>
              <Route index element={<Userlist />} />
              <Route path="usuarios" element={<Userlist />} /> 
              <Route path="ver-cliente/:id" element={<ViewCliente />} />        
              <Route path="lista-categorias" element={<Categorialist />} />
              <Route path="lista-marcas-de-autos" element={<Marcaautolist />} />
              <Route path="lista-servicios-mantenimiento-y-reparacion" element={<Serviciosmantreplist />} />
              <Route path="producto" element={<Agregarproducto />} />
              <Route path="producto/:id" element={<Agregarproducto />} />     
              <Route path="ver-producto/:id" element={<DetalleProducto />} />     
              <Route path="lista-productos" element={<Productlist />} />
              <Route path="empleado" element={<AgregarEmpleado />} />
              <Route path="empleado/:id" element={<AgregarEmpleado />} />
              <Route path="lista-empleados" element={<Empleadolist />} />
              <Route path="ver-empleado/:id" element={<ViewEmpleado />} />        
              <Route path="lista-roles" element={<Rollist />} />
              <Route path="lista-proveedores" element={<Proveedoreslist />} />
              <Route path="proveedor" element={<AgregarProveedor />} />
              <Route path="/admin/ver-Perfil" element={<ViewProfile />} />
              <Route path="/admin/ver-Notificaciones" element={<ViewNotf />} />
              <Route path="proveedor/:id" element={<AgregarProveedor />} />  
              <Route path="ver-proveedor/:id" element={<ViewProveedor />} />        
              <Route path="ventas" element={<AgregarVenta />} />    
              <Route path="lista-venta" element={<VentaList />} />
              <Route path="ver-venta/:id" element={<DetalleVenta />} />     
              <Route path="resumen" element={<ResumenVentas />} />    
  

            </Route>
            {/* cierreadmin */}
          </Routes>
        </div>
      </Router>
      {/* <div className="flex justify-center items-center">
        <NavigateComponents />
      </div> */}
    </RecoveryContext.Provider>
  );
}

export default App;
