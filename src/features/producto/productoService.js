import axios from "axios";
import { config } from "../../utils/axiosconfig";
import { base_url } from "../../utils/baseUrl";

const getProducts = async () => {
  //listo
  const response = await axios.get(`${base_url}producto/`);
  return response.data;
};

const createProduct = async (product) => {
  //listo
  const response = await axios.post(`${base_url}producto/`, product, config);
  return response.data;
};

const getProduct = async (id) => {
  //listo
  const response = await axios.get(`${base_url}producto/${id}`, config);
  return response.data;
};

const deleteProduct = async (product) => {//listo
  const response = await axios.delete(`${base_url}producto/${product}`, config);
  return response.data;
};

const getProductByCategory = async (categoryId) => {
    const response = await axios.get(`${base_url}producto?categoria=${categoryId}`);
    return response.data;
}

const getProductByMarca = async (marcaId) => {
  const response = await axios.get(`${base_url}producto?marca_auto=${marcaId}`);
  return response.data;
}

const getProductByServicios = async (serviciosId) => {
  const response = await axios.get(`${base_url}producto?servicios=${serviciosId}`);
  return response.data;
}

const getProductByColor = async (colorId) => {
  const response = await axios.get(`${base_url}producto?variaciones.color=${colorId}`);
  return response.data;
}

const updateProduct = async (product) => {//listo
  const response = await axios.put(
    `${base_url}producto/${product.id}`,
    {
      nombre: product.productData.nombre,
      descripcion: product.productData.descripcion,
      cantidad_disponible: product.productData.cantidad_disponible,
      ubicacion: product.productData.ubicacion,
      precio: product.productData.precio,
      categoria: product.productData.categoria,
      referencia: product.productData.referencia,
      marca_auto: product.productData.marca_auto,
      imagenes: product.productData.imagenes,      
      activo: product.productData.activo,
      proveedores: product.productData.proveedores,
      referencia: product.productData.referencia,
    },
    config
  );
  return response.data;
};

const productService = {
  getProducts,
  getProduct,
  updateProduct,
  createProduct,
  deleteProduct,
  getProductByCategory,
  getProductByServicios,
  getProductByMarca,
  getProductByColor,
};

export default productService;
