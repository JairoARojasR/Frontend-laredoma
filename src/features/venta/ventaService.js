import axios from "axios";
import { config } from "../../utils/axiosconfig";
import { base_url } from "../../utils/baseUrl";


const getVentas = async () => {
    const response = await axios.get(`${base_url}venta/`);
    return response.data; 
  };

  const getVenta = async (id) => {
    try {
      const response = await axios.get(`${base_url}venta/${id}`, config);
      return response.data;
    } catch (error) {
      console.error("Error al obtener la categoria:", error);
    }
  };

  const createVenta = async (venta) => {
    console.log("LLEGAAAAAAAAAAAAAAAAAAAAAA");
    const response = await axios.post(`${base_url}venta/crearVenta`, venta, config);
    console.log("LLEGAAAAAAAAAAAAAAAAAAAAAA");
    return response.data;
  };

  const ventaService = {
    getVenta, 
    getVentas,
    createVenta
  };

  export default ventaService;

  
