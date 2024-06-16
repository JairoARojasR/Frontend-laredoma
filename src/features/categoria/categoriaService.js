import axios from "axios";
import { config } from "../../utils/axiosconfig";
import { base_url } from "../../utils/baseUrl";

const getCategorias = async () => {
  const response = await axios.get(`${base_url}categoria/`);
  return response.data; 
};

const createCategoria = async (categoria) => {
  const response = await axios.post(`${base_url}categoria/`, categoria, config);
  return response.data;
};

const getCategoria = async (id) => {
  try {
    const response = await axios.get(`${base_url}categoria/${id}`, config);
    return response.data;
  } catch (error) {
    console.error("Error al obtener la categoria:", error);
  }
};


const deleteCategoria = async (id) => {
  const response = await axios.delete(`${base_url}categoria/${id}`, config);
  return response.data;
}; 

const updateCategoria = async (categoria) => {
  const response = await axios.put(
    `${base_url}categoria/${categoria.id}`,
    { nombre: categoria.pCatData.nombre,
      activo: categoria.pCatData.activo
    },
    config
  );
  return response.data;
};
const categoriaService = {
  getCategorias,
  createCategoria,
  getCategoria,
  deleteCategoria,
  updateCategoria
};

export default categoriaService;
