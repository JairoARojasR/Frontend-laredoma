import { configureStore } from "@reduxjs/toolkit";
import productoReducer from "../features/producto/productoSlice";
// import tallaReducer from "../features/talla/tallaSlice";
   import categoriaReducer from "../features/categoria/categoriaSlice";
// import colorReducer from "../features/color/colorSlice";
import uploadReducer from "../features/upload/uploadSlice";
import userReducer from "../features/usuario/usuarioSlice"
import marcaautoReducer from "../features/marca_auto/marcaautoSlice"
import serviciosmantrepReducer from "../features/serviciosmantrep/serviciosmantrepSlice"
export const reduxConfig = configureStore({
  reducer: { 
    categoria: categoriaReducer,
    marcaauto: marcaautoReducer,
    serviciosmantrep: serviciosmantrepReducer,
    producto: productoReducer,

    //producto: productoReducer,
    // size: tallaReducer,
    // color: colorReducer,
    upload: uploadReducer,
    user: userReducer,
  },
});
