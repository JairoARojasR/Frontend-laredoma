import React, { useEffect, useState } from "react";
import { Table, Space, Switch } from "antd";
import { BiEdit } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import servicioService from "../features/serviciosmantrep/serviciosmantrepService";
import productService from "../features/producto/productoService";
import { deleteServiciomantrep, getServiciosmantrep, resetState } from "../features/serviciosmantrep/serviciosmantrepSlice";
import CustomModal from "../components/CustomModal";

const columns = [
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

const Serviciosmantreplist = () => {
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
      await servicioService.updateServiciosmantrep({
        id: categoryId,
        pCatData: {
          [property]: checked,
        },
      });
      dispatch(getServiciosmantrep());
      const message = checked
        ? `El servicio de mantenimiento-reparación está ${property} actualmente`
        : `El servicio de mantenimiento-reparación no está ${property} actualmente`;

      toast.success(message);
    } catch (error) {
      const errorMessage = `Error al cambiar el estado de ${property} del servicio de mantenimiento-reparación`;
      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    dispatch(resetState());
    dispatch(getServiciosmantrep());
  }, [dispatch]);

  const servicios = useSelector((state) => state.serviciosmantrep.servicios);
  const data = servicios.map((categoria, index) => ({
    key: index + 1,
    nombre: categoria.nombre,
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
        await dispatch(deleteServiciomantrep(categoryId));
        setOpen(false);
        dispatch(getServiciosmantrep());
        toast.success("Categoría eliminada exitosamente!");
      }
    } catch (error) {
      console.error("Error al intentar eliminar la categoría:", error);
      toast.error("Error al intentar eliminar la categoría.");
    }
  };

  return (
    <div>
      <h3 className="mb-4 title">Lista de Servicios de Mantenimiento y Reparación</h3>
      <Table columns={columns} dataSource={data} />
      <CustomModal
        hideModal={hideModal}
        open={open}
        performAction={() => {
          deleteServiciomantrep(pCatId);
        }}
        title="¿Estás seguro de que quieres eliminar esta categoría de productos?"
      />
    </div>
  );
};

export default Serviciosmantreplist;
