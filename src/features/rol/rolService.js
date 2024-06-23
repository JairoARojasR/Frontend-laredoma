import axios from "axios";
import { config } from "../../utils/axiosconfig";
import { base_url } from "../../utils/baseUrl";

const getRoles = async () => {
  const response = await axios.get(`${base_url}rol/`);
  return response.data; 
};

const createRol = async (rol) => {
  const response = await axios.post(`${base_url}rol/`, rol, config);
  return response.data;
};

const getRol = async (id) => {
  try {
    const response = await axios.get(`${base_url}rol/${id}`, config);
    return response.data;
  } catch (error) {
    console.error("Error al obtener la rol:", error);
  }
};


const deleteRol = async (id) => {
  const response = await axios.delete(`${base_url}rol/${id}`, config);
  return response.data;
}; 

const updateRol = async (rol) => {
  const response = await axios.put(
    `${base_url}rol/${rol.id}`,
    { nombre: rol.pCatData.nombre,
      activo: rol.pCatData.activo
    },
    config
  );
  return response.data;
};
const rolService = {
  getRoles,
  createRol,
  getRol,
  deleteRol,
  updateRol
};

export default rolService;
