import React, { useEffect, useState } from "react";
import { Table, Space, Switch } from "antd";
import { BiEdit } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import categoryService from "../features/categoria/categoriaService";
import productService from "../features/producto/productoService";
import { deleteCategoria, getCategorias, resetState } from "../features/categoria/categoriaSlice";
import CustomModal from "../components/CustomModal";

const columns = [
  {
    title: "N°",
    dataIndex: "key",
  },
  {
    title: "Nombre",
    dataIndex: "nombre",
  },
  {
    title: "Activo",
    dataIndex: "estado",
  },
  {
    title: "Acciones",
    dataIndex: "action",
  },
];

const Categorylist = () => {
  const [open, setOpen] = useState(false);
  const [pCatId, setpCatId] = useState("");
  const dispatch = useDispatch();

  const showModal = (categoryId) => {
    setOpen(true);
    setpCatId(categoryId);
  };

  const hideModal = () => {
    setOpen(false);
  };

  const handleSwitchChange = async (categoryId, property, checked) => {
    try {
      await categoryService.updateCategoria({
        id: categoryId,
        pCatData: {
          [property]: checked,
        },
      });
      dispatch(getCategorias());

      const message = checked
        ? `La categoría está ${property} actualmente`
        : `La categoría no está ${property} actualmente`;

      toast.success(message);
    } catch (error) {
      const errorMessage = `Error al cambiar el estado de ${property} de la categoría`;
      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    dispatch(resetState());
    dispatch(getCategorias());
  }, [dispatch]);

  const categorias = useSelector((state) => state.categoria.categorias);
  const data = categorias.map((categoria, index) => ({
    key: index + 1,
    nombre: (
      <Link to={`/admin/categoria/${categoria.nombre}/productos`}>
        {categoria.nombre}
      </Link>
    ),
    estado: (
      <Space direction="vertical">
        <Switch
          checkedChildren={<CheckOutlined />}
          unCheckedChildren={<CloseOutlined />}
          defaultChecked={categoria.activo}
          onChange={(checked) =>
            handleSwitchChange(categoria._id, "activo", checked)
          }
        />
      </Space>
    ),
    action: (
      <>
        <Link
          to={`/admin/categoria/${categoria._id}`}
          className=" fs-3 text-danger"
        >
          <BiEdit />
        </Link>
        <button
          className="ms-3 fs-3 text-danger bg-transparent border-0"
          onClick={() => showModal(categoria._id)}
        >
          <AiFillDelete />
        </button>
      </>
    ),
  }));

  const deleteCategory = async (categoryId) => {
    try {
      const productsInCategory = await productService.getProductByCategory(categoryId);

      if (productsInCategory.length > 0) {
        toast.error(
          `No se puede eliminar la categoría porque está asociada a ${productsInCategory.length} productos.`
        );
      } else {
        await dispatch(deleteCategoria(categoryId));
        setOpen(false);
        dispatch(getCategorias());
        toast.success("Categoría eliminada exitosamente!");
      }
    } catch (error) {
      console.error("Error al intentar eliminar la categoría:", error);
      toast.error("Error al intentar eliminar la categoría.");
    }
  };

  return (
    <div>
      <h3 className="mb-4 title">Lista de categorías</h3>
      <Table columns={columns} dataSource={data} />
      <CustomModal
        hideModal={hideModal}
        open={open}
        performAction={() => {
          deleteCategory(pCatId);
        }}
        title="¿Estás seguro de que quieres eliminar esta categoría de productos?"
      />
    </div>
  );
};

export default Categorylist;
