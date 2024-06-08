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
// import Colorlist from "./pages/Colorlist";
// import Addcolor from "./pages/Addcolor";
// import Categorylist from "./pages/Categorylist";
// import Addcategory from "./pages/Addcategory";
// import AddSeller from "./pages/AddSeller";
// import Sellerlist from "./pages/Sellerlist";
// import Addsize from "./pages/Addsize";
// import Sizelist from "./pages/Sizelist";
import Productlist from "./pages/Productlist";
// import Addproduct from "./pages/Addproduct";
// import Viewproduct from "./pages/Viewproduct";
// import ViewproductCliente from "./pages/ViewproductCliente";
 import Userlist from "./pages/Userlist";
 import Categorialist from "./pages/Categorialist";
 import Marcaautolist from "./pages/Marcaautolist";
 import Serviciosmantreplist from "./pages/Serviciosmantreplist";
 import Agregarproducto from "./pages/Agregarproducto";
// import AssociatedProducts from "./pages/AssociatedProducts";
 import ConfirmacionUsuario from "./pages/ConfirmacionUsuario";
// import Womenproduct from "./pages/Womenproduct";
// import Manproduct from "./pages/Manproduct";
 import LoginFormp from "./components/LoginFormp";
 import OTPInput from "./pages/OTPInput";
 import Recovered from "./pages/Recovered";
 import Reset from "./pages/Reset";
// import Store from "./pages/Store";
// import ViewProfile from "./pages/viewProfile";
// import ViewProfileAdmin from "./pages/ViewProfileAdmin";
// import ViewCustomer from "./pages/ViewCustomer";
// import ViewSeller from "./pages/ViewSeller";
// import Homepage from "./pages/Homepage";

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
    // Obtener el email y el OTP del localStorage al cargar la aplicación
    const storedEmail = localStorage.getItem("email");
    const storedOTP = localStorage.getItem("otp");

    // Verificar si se han recuperado los valores del email y del OTP
    if (storedEmail && storedOTP) {
      // Establecer los valores recuperados en el estado
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
            <Route path="/login" element={<Login />} />


            {/* admin */}

            <Route path="/admin" element={<MainLayout />}>
              <Route index element={<Userlist />} />
              <Route path="usuarios" element={<Userlist />} /> 
              <Route path="lista-categorias" element={<Categorialist />} />
              <Route path="lista-marcas-de-autos" element={<Marcaautolist />} />
              <Route path="lista-servicios-mantenimiento-y-reparacion" element={<Serviciosmantreplist />} />
              <Route path="producto" element={<Agregarproducto />} />
              <Route path="lista-productos" element={<Productlist />} />
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
