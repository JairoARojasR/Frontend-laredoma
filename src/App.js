import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import React, { createContext, useState, useEffect } from "react";
//import Login from "./pages/Login";
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
// import ConfirmacionUsuario from "./pages/ConfirmacionUsuario";
// import Womenproduct from "./pages/Womenproduct";
// import Manproduct from "./pages/Manproduct";
// import LoginFormp from "./components/LoginFormp";
// import OTPInput from "./pages/OTPInput";
// import Recovered from "./pages/Recovered";
// import Reset from "./pages/Reset";
// import Store from "./pages/Store";
// import ViewProfile from "./pages/viewProfile";
// import ViewProfileAdmin from "./pages/ViewProfileAdmin";
// import ViewCustomer from "./pages/ViewCustomer";
// import ViewSeller from "./pages/ViewSeller";
// import Homepage from "./pages/Homepage";

export const RecoveryContext = createContext();

function App() {
  // const [page, setPage] = useState("loginFormp");
  // const [email, setEmail] = useState();
  // const [otp, setOTP] = useState();

  // function NavigateComponents() {
  //   if (page === "otp") return <OTPInput />;
  //   if (page === "reset") return <Reset />;
  //   //  return <Recovered />;
  // }

  // useEffect(() => {
  //   // Obtener el email y el OTP del localStorage al cargar la aplicación
  //   const storedEmail = localStorage.getItem("email");
  //   const storedOTP = localStorage.getItem("otp");

  //   // Verificar si se han recuperado los valores del email y del OTP
  //   if (storedEmail && storedOTP) {
  //     // Establecer los valores recuperados en el estado
  //     setEmail(storedEmail);
  //     setOTP(storedOTP);
  //   }
  // }, []);

  return (
    <RecoveryContext.Provider>
      <Router>
        <div>
          <Routes>
            {/* admin */}

            <Route path="/admin" element={<MainLayout />}>
              {/* <Route path="list-color" element={<Colorlist />} />
              <Route path="color" element={<Addcolor />} />
              <Route path="color/:id" element={<Addcolor />} />
              <Route path="lista-categorias" element={<Categorylist />} />
              <Route path="categoria" element={<Addcategory />} />
              <Route path="categoria/:id" element={<Addcategory />} />
              <Route path="lista-tallas" element={<Sizelist />} />
              <Route path="talla" element={<Addsize />} />
              <Route path="talla/:id" element={<Addsize />} />
              <Route path="vendedor" element={<AddSeller />} />
              <Route path="vendedor/:id" element={<AddSeller />} />
              <Route path="lista-vendedores" element={<Sellerlist />} />
              <Route path="lista-productos" element={<Productlist />} />
              <Route path="producto" element={<Addproduct />} />
              <Route path="producto/:id" element={<Addproduct />} />
              <Route path="ver-producto/:id" element={<Viewproduct />} />
              <Route path="ver-cliente/:correo" element={<ViewCustomer />} />
              <Route path="/admin/ver-Perfil" element={<ViewProfileAdmin />} />
              <Route path="ver-vendedor/:correo" element={<ViewSeller />} />
              <Route path="categoria/:id/productos" element={<AssociatedProducts />}
              />*/}
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
