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
      precio: product.productData.precio,
      precioConDescuento: product.productData.precioConDescuento,
      descuento: product.productData.descuento,
      cinta: product.productData.cinta,
      categoria: product.productData.categoria,
      variaciones: product.productData.variaciones,
      activo: product.productData.activo,
      visible: product.productData.visible,
      referencia: product.productData.referencia,
      genero: product.productData.genero,
      tipoTela: product.productData.tipoTela
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
  getProductByMarca,
  getProductByColor,
};

export default productService;
