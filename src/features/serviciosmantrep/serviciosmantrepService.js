import axios from "axios";
import { config } from "../../utils/axiosconfig";
import { base_url } from "../../utils/baseUrl";

const getServiciosmantrep = async () => {
  const response = await axios.get(`${base_url}servicios/`);
  return response.data; 
};

const createServiciosmantrep = async (servicio) => {
  const response = await axios.post(`${base_url}servicios/`, servicio, config);
  return response.data;
};


const getServiciomantrep = async (id) => {
  try {
    const response = await axios.get(`${base_url}servicios/${id}`, config);
    return response.data;
  } catch (error) {
    console.error("Error al obtener el servicio:", error);
  }
};


const deleteServiciosmantrep = async (id) => {
  const response = await axios.delete(`${base_url}servicios/${id}`, config);
  return response.data;
}; 

const updateServiciosmantrep = async (servicio) => {
  const response = await axios.put(
    `${base_url}servicios/${servicio.id}`,
    { nombre: servicio.pCatData.nombre,
      activo: servicio.pCatData.activo
    },
    config
  );
  return response.data;
};
const serviciosmantrepService = {
  getServiciosmantrep,
  createServiciosmantrep,
  getServiciomantrep,
  deleteServiciosmantrep,
  updateServiciosmantrep
};

export default serviciosmantrepService;
