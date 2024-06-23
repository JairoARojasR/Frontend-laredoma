import { configureStore } from "@reduxjs/toolkit";
import productoReducer from "../features/producto/productoSlice";
// import tallaReducer from "../features/talla/tallaSlice";
   import categoriaReducer from "../features/categoria/categoriaSlice";
// import colorReducer from "../features/color/colorSlice";
import uploadReducer from "../features/upload/uploadSlice";
import rolReducer from "../features/rol/rolSlice"
import userReducer from "../features/usuario/usuarioSlice"
import marcaautoReducer from "../features/marca_auto/marcaautoSlice"
import serviciosmantrepReducer from "../features/serviciosmantrep/serviciosmantrepSlice"
import ventaReducer from "../features/venta/ventaSlice" 
import permisoReducer from "../features/permisos/permisosSlice"
export const reduxConfig = configureStore({
  reducer: { 
    categoria: categoriaReducer,
    marcaauto: marcaautoReducer,
    serviciosmantrep: serviciosmantrepReducer,
    producto: productoReducer,
    venta: ventaReducer,
    //producto: productoReducer,
    // size: tallaReducer,
    // color: colorReducer,
    rol: rolReducer,
    upload: uploadReducer,
    user: userReducer,
    permiso: permisoReducer,
  },
});
