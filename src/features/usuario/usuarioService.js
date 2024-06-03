import axios from "axios";
import { config } from "../../utils/axiosconfig";
import { base_url } from "../../utils/baseUrl";

const getUsers = async () => {
  //listo
  const response = await axios.get(`${base_url}persona/`);
  return response.data;
};

const createSeller = async (user) => {
  //listo
  const response = await axios.post(`${base_url}persona/crear-vendedor`, user, config);

  return response.data;
};

const createUser = async (user) => {
  //listo
  const response = await axios.post(`${base_url}persona/`, user, config);
  if (response.data) {
    config.headers.Authorization="Bearer " + response.data.token;
    localStorage.setItem("user", JSON.stringify(response.data));
    }
  return response.data;
};

const resetPassword = async (passwordData) => {
  try {
    const response = await axios.post(`${base_url}persona/reset-password`, passwordData, config);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || "Error al resetear la contraseña.");
  }
};

const confirm = async (token) => {
  //listo
  const response = await axios.get(`${base_url}persona/confirm/${token}`, config);
  return response.data;
};

const getUser = async (correo) => {
  try {
    const response = await axios.get(`${base_url}persona/correo/${correo}`, config);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error al obtener el usuario:", error);
  }
};



const getCustomer = async (cedula) => {
  try {
    const response = await axios.get(`${base_url}persona/cedula/${cedula}`, config);
    return response.data;
  } catch (error) {
    console.error("Error al obtener el usuario:", error);
  }
};

const deleteUser = async (user) => {//listo
  const response = await axios.delete(`${base_url}persona/${user}`, config);
  return response.data;
};

const loginUser = async (loginData) => {
    const response = await axios.post(`${base_url}persona/login`, loginData, config);
    if (response.data) {
    config.headers.Authorization="Bearer " + response.data.token;
    localStorage.setItem("user", JSON.stringify(response.data));
    }
    return response.data;
 
};

const logoutUser = async () => {
    const response = await axios.get(`${base_url}persona/logout`);
    localStorage.removeItem("user");
    console.log("localstorage",localStorage);
    config.headers.Authorization="";
    return response.data;
};
  
const updateUser = async (user) => {//listo
  const response = await axios.put(
    `${base_url}persona/${user.id}`,
    {
      nombre: user.userData.nombre,
      correo: user.userData.correo,
      contrasenia: user.userData.contrasenia,
      rol: user.userData.rol,
      code: user.userData.code,
      estado: user.userData.estado,
    },
    config
  );
  return response.data;
};

const updateUserByEmail = async (user) => {//listo
  const response = await axios.put(
    `${base_url}persona/actualizar-datos/${user.userData.correo}`,
    {
      nombre: user.userData.nombre,
      correo: user.userData.correo,
      cedula: user.userData.cedula,
      fechaNacimiento: user.userData.fechaNacimiento,
    },
    config
  );
  return response.data;
};

const updateSellerByEmail = async (user) => {//listo
  const response = await axios.put(
    `${base_url}persona/actualizar-vendedor/${user.correoaux}`,
    {
      nombre: user.userData.nombre,
      correo: user.userData.correo,
      cedula: user.userData.cedula,
    },
    config
  );
  return response.data;
};


const userService = {
  getUsers,
  getUser,
  updateUser,
  confirm,
  resetPassword,
  getCustomer,
  updateSellerByEmail,
  createSeller,
  logoutUser,
  updateUserByEmail,
  createUser,
  deleteUser,
  loginUser,
};

export default userService;
