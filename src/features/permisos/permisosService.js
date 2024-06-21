import axios from "axios";
import { config } from "../../utils/axiosconfig";
import { base_url } from "../../utils/baseUrl";


const getPermisos = async () => {
    const response = await axios.get(`${base_url}permiso/`);
    return response.data; 
  };

  const permisoService = {
    getPermisos,
  };

  export default permisoService;
