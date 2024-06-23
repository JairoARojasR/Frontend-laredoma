import React, { useEffect, useState, useRef } from "react";
import { BiEdit } from "react-icons/bi";
import { BsEye } from "react-icons/bs";
import { AiFillDelete } from "react-icons/ai";
import { Button, Flex, Tooltip } from "antd";
import { Input, Space } from "antd";
import Highlighter from "react-highlight-words";
import CustomTable from "../components/CustomTable";
import CustomModal from "../components/CustomModal";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-toastify";
import { Switch } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import {
  getProducts,
  resetState,
  deleteAProduct,
} from "../features/producto/productoSlice";
import { getCategorias } from "../features/categoria/categoriaSlice";
import productService from "../features/producto/productoService";
import { Link } from "react-router-dom";

import {
  SearchOutlined,
  EditOutlined,
  EyeOutlined,
  CheckSquareOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

//import "../components/prueba.css";
import dayjs from 'dayjs';

const Productlist = () => {
  const [open, setOpen] = useState(false);
  const [productId, setProductId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoriesLoaded, setCategoriesLoaded] = useState(false); // Nuevo estado para controlar si las categorías ya se han cargado
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSearch = (event) => setSearchTerm(event.target.value);
  const { Search } = Input;

  const goBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    dispatch(resetState());
    dispatch(getProducts());
    if (!categoriesLoaded) {
      dispatch(getCategorias());
      setCategoriesLoaded(true);
    }
  }, [categoriesLoaded]); 

  const handleSwitchChange = async (productId, property, checked) => {
    try {
      await productService.updateProduct({
        id: productId,
        productData: {
          [property]: checked,
        },
      });
      dispatch(getProducts());

      const message = checked
        ? `El Producto está ${property} actualmente`
        : `El Producto no está ${property} actualmente`;

      toast.success(message);
    } catch (error) {
      const errorMessage = `Error al cambiar el estado de ${property} del Producto`;
      toast.error(errorMessage);
    }
  };
  const catState = useSelector((state) => state.categoria.categorias);
  const productState = useSelector((state) => state.producto.products);
  const [data1, setData1] = useState([]);

  const generateData = async (products) => {
    const categoriesMap = {};
    catState.forEach(category => {
        categoriesMap[category._id] = category.nombre;
    });
  
    const newData = await Promise.all(
      products.filter((product) => {
        return (
          product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (categoriesMap[product.categoria] && categoriesMap[product.categoria].toLowerCase().includes(searchTerm.toLowerCase())) || 
          product.precio.toString().includes(searchTerm) ||
          product.referencia.toString().includes(searchTerm) ||
          dayjs(product.createdAt).format('DD-MM-YYYY').includes(searchTerm) ||
          dayjs(product.updatedAt).format('DD-MM-YYYY').includes(searchTerm)
          );
        }).map(async (product, i) => {
        return {
          key: i + 1,
          nombre: product.nombre,
          descripcion: product.descripcion,
          categoria: categoriesMap[product.categoria] || '', 
          precio: `${product.precio}`,
          referencia: product.referencia,
          variaciones: product.variaciones,
          estado: (
            <Space direction="vertical">
              <Switch
                checkedChildren={<CheckOutlined />}
                unCheckedChildren={<CloseOutlined />}
                defaultChecked={product.activo}
                onChange={(checked) =>
                  handleSwitchChange(product._id, "activo", checked)
                }
              />
            </Space>
          ),
          createdAt: dayjs(product.createdAt).format('DD-MM-YYYY'),
          updatedAt: dayjs(product.updatedAt).format('DD-MM-YYYY'),
          action: (
            <div className="button-container">
              <Link
                to={`/admin/ver-producto/${product._id}`}
                className="custom-button"
              >
                <Tooltip title="Ver">
                  <Button
                    type="primary"
                    shape="circle"
                    icon={<EyeOutlined />}
                    className="custom-button-inner"
                  />
                </Tooltip>
              </Link>
  
              <Link
                to={`/admin/producto/${product._id}`}
                className="custom-button"
              >
                <Tooltip title="Editar">
                  <Button
                    type="primary"
                    shape="circle"
                    icon={<EditOutlined />}
                    className="custom-button-inner"
                  />
                </Tooltip>
                </Link>

                {/* <button
                  className="custom-button"
                  onClick={() => showModal(product._id)}
                >
                  <Tooltip title="Eliminar">
                    <Button
                      type="primary"
                      shape="circle"
                      icon={<DeleteOutlined />}
                      className="custom-button-inner"
                    />
                  </Tooltip>
                </button> */}
              </div>
            ),
          };
        })
    );
    setData1(newData);
  };
  useEffect(() => {
    generateData(productState);
  }, [productState, searchTerm]);

  const deleteProduct = async (productId) => {
    await dispatch(deleteAProduct(productId));
    setOpen(false);
    dispatch(getProducts());
    toast.success("Producto eliminado exitosamente!");
  };

  const showModal = (productId) => {
    setOpen(true);
    setProductId(productId);
  };

  const hideModal = () => {
    setOpen(false);
  };

  const columns = [
    {
      title: "Referencia",
      dataIndex: "referencia",
    },
    {
      title: "Nombre",
      dataIndex: "nombre",
      sorter: (a, b) => a.nombre.length - b.nombre.length,
    },
    {
      title: "Categoria",
      dataIndex: "categoria",
      sorter: (a, b) => a.categoria.length - b.categoria.length,
    },
    {
      title: "Precio",
      dataIndex: "precio",
      sorter: (a, b) => a.precio - b.precio,
    },
    {
      title: "Activo",
      dataIndex: "estado",
    },
    {
      title: "   Fecha   de   Creación del Producto  ",
      dataIndex: "createdAt",
    },
    {
      title: "Última Actualización",
      dataIndex: "updatedAt",
    },
    {
      title: "Acciones",
      dataIndex: "action",
    },
  ];

  return (
    <div>
      <h3 className="mb-4 title">Lista de productos</h3>

      <Input
        placeholder="Filtro Productos"
        onChange={onSearch}
        style={{
          width: 150,
          marginBottom: 20,
        }}
        suffix={<SearchOutlined />}

      />
      <CustomTable columns={columns} dataSource={data1} />
      {/* <CustomModal
        hideModal={hideModal}
        open={open}
        performAction={() => {
          deleteProduct(productId);
        }}
        title="¿Estás seguro/a de que deseas eliminar este producto?"
      /> */}
    </div>
  );
};

export default Productlist;
