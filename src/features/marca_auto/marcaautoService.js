import axios from "axios";
import { config } from "../../utils/axiosconfig";
import { base_url } from "../../utils/baseUrl";

const getMarcasauto = async () => {
  const response = await axios.get(`${base_url}marca-auto/`);
  return response.data;
};

const createMarcasauto = async (marcaauto) => {
  const response = await axios.post(`${base_url}marca-auto/`, marcaauto, config);
  return response.data;
};

const getMarcaauto = async (id) => {
  try {
    const response = await axios.get(`${base_url}marca-auto/${id}`, config);
    return response.data;
  } catch (error) {
    console.error("Error al obtener la marca de auto", error);
  }
};


const deleteMarcaauto = async (id) => {
  const response = await axios.delete(`${base_url}marca-auto/${id}`, config);
  return response.data;
}; 

const updateMarcaauto = async (marcaauto) => {
  const response = await axios.put(
    `${base_url}marca-auto/${marcaauto.id}`,
    { nombre: marcaauto.marcaData.nombre,
      activo: marcaauto.marcaData.activo
    },
    config
  );
  return response.data;
};
const marcaautoService = {
  getMarcasauto,
  createMarcasauto,
  getMarcaauto,
  deleteMarcaauto,
  updateMarcaauto
};

export default marcaautoService;
