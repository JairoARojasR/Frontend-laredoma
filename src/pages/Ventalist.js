import React, { useEffect, useState } from "react";
import { Button, Tooltip } from "antd";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { EyeOutlined } from "@ant-design/icons";
import dayjs from 'dayjs';
import CustomTable from "../components/CustomTable";
import { getVentas } from "../features/venta/ventaSlice";
import { getUsers } from "../features/usuario/usuarioSlice";

const Ventalist = () => {
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(getVentas());
    dispatch(getUsers());
  }, [dispatch]);

  const ventaState = useSelector((state) => state.venta.ventas);
    const userState = useSelector((state) => state.user.users);

  const [data, setData] = useState([]);

  
  useEffect(() => {
    console.log("Ventas cargadas:", ventaState); // Puedes eliminar este console.log si ya no lo necesitas
    generateData(ventaState);
  }, [ventaState]);

  const generateData = (ventas) => {
    const newData = ventas.map((item) => ({
      key: item.venta._id,
      id_cajera: item.venta.id_cajera,
      id_cliente: item.venta.id_cliente,
      total_venta: item.venta.total_venta,
      metodo_pago: item.venta.metodo_pago,
      fecha: dayjs(item.venta.fecha).format("DD-MM-YYYY"),
      createdAt: dayjs(item.venta.createdAt).format("DD-MM-YYYY"),
      updatedAt: dayjs(item.venta.updatedAt).format("DD-MM-YYYY"),
      action: (
        <div className="button-container">
          <Link to={`/admin/ver-venta/${item.venta._id}`} className="custom-button">
            <Tooltip title="Ver">
              <Button
                type="primary"
                shape="circle"
                icon={<EyeOutlined />}
                className="custom-button-inner"
              />
            </Tooltip>
          </Link>
        </div>
      ),
    }));

    setData(newData);
  };

  const columns = [
    {
      title: "Nombre cajera",
      dataIndex: "id_cajera",
      key: "id_cajera",
      render: (id_cajera) => {
        const usuario = userState.find(
          (u) => u._id === id_cajera
        );
        return usuario
          ? usuario.nombre
          : "Cajera no encontrado";
      },
    },
    {
      title: "Nombre Cliente",
      dataIndex: "id_cliente",
      key: "id_cliente",
      render: (id_cliente) => {
        const usuario = userState.find(
          (u) => u._id === id_cliente
        );
        return usuario
          ? usuario.nombre
          : "Cliente no encontrado";
      },
    },
    {
      title: "Cédula",
      dataIndex: "id_cliente",
      key: "id_cliente",
      render: (id_cliente) => {
        const usuario = userState.find(
          (u) => u._id === id_cliente
        );
        return usuario
          ? usuario.cedula
          : "Cliente no encontrado";
      },
    },
    {
      title: "Total Venta",
      dataIndex: "total_venta",
      sorter: (a, b) => a.total_venta - b.total_venta,
    },
    {
      title: "Método de Pago",
      dataIndex: "metodo_pago",
    },
    {
      title: "Fecha",
      dataIndex: "fecha",
      sorter: (a, b) => new Date(a.fecha) - new Date(b.fecha),
    },
    {
      title: "Fecha de Creación",
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
      <h3 className="mb-4 title">Lista de Ventas</h3>
      <CustomTable columns={columns} dataSource={data} />
    </div>
  );
};

export default Ventalist;
