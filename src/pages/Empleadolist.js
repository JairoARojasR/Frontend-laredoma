

import React, { useEffect, useState, useRef } from "react";
import { Button, Flex, Tooltip, Switch } from "antd";
import { Input, Space } from "antd";
import Highlighter from "react-highlight-words";
import CustomTable from "../components/CustomTable";
import CustomModal from "../components/CustomModal";
import withBodyClass from "../components/wrapper";
import "../styles/Body.pages.css"
import { useDispatch, useSelector } from "react-redux";
import ButtonCustom from "../components/ButtonCustom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import usuarioService from "../features/usuario/usuarioService"
import {
  CheckOutlined,
  CloseOutlined,
  ManOutlined,
  WomanOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";
import {
  getUsers,
  resetState,
  deleteAUser,
  updateAUser,
} from "../features/usuario/usuarioSlice";
import { Link } from "react-router-dom";
import {
  SearchOutlined,
  EditOutlined,
  EyeOutlined,
  DeleteOutlined,
} from "@ant-design/icons";


const columns = [
  {
    title: "Cedula",
    dataIndex: "cedula",
    sorter: (a, b) => a.nombre.length - b.nombre.length,
  },

  {
    title: "Nombre",
    dataIndex: "nombre",
    sorter: (a, b) => a.nombre.length - b.nombre.length,
  },

  {
    title: "Correo",
    dataIndex: "correo",
    sorter: (a, b) => a.correo.length - b.correo.length,
  },
  {
    title: "Rol",
    dataIndex: "rol",
    sorter: (a, b) => a.rol.length - b.rol.length,
  },
  {
    title: "Estado",
    dataIndex: "activo",
    sorter: (a, b) => a.precio - b.precio,
  },
  {
    title: "Acciones",
    dataIndex: "action",
  },
];

const Empleadolist = () => {
  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState("");
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const dispatch = useDispatch();

  const userState = useSelector((state) => state.user.users) || [];
  const [setData1] = useState([]);

  const handleSwitchChange = async (userId, property, checked) => {
    try {
      await usuarioService.updateUser({
        id: userId,
        userData: {
          activo: checked ? "Activo" : "Inactivo",
        },
      });
      dispatch(getUsers());

      let message = "";
      if (property === "activo") {
        message = checked
          ? "El vendedor está activado actualmente"
          : "El vendedor está desactivado actualmente";
      }
      toast.success(message);
    } catch (error) {
      let errorMessage = `Error al cambiar el estado del vendedor`;
      toast.error(errorMessage);
    }
  };

  const data1 = [];
  for (let i = 0; i < userState.length; i++) {
    if (userState[i].id_rol === "6669074f41dcdb08eee0128e" || userState[i].id_rol === "6669075e41dcdb08eee01291") {
      data1.push({
        key: i + 1,
        nombre: userState[i].nombre,
        cedula: userState[i].cedula,
        correo: userState[i].correo,
        rol: userState[i].id_rol,
        contrasenia: userState[i].contrasenia,
        activo: (
          <Space direction="vertical">
            <Switch
              checkedChildren={<CheckOutlined />}
              unCheckedChildren={<CloseOutlined />}
              defaultChecked={userState[i].activo}
              onChange={(checked) => handleSwitchChange(userState[i]._id, 'activo', checked)}
            />
          </Space>
        ),
        action: (
          <div className="button-container">
            <ButtonCustom
              action={`/admin/ver-vendedor/${userState[i].correo}`}
              icon={<EyeOutlined />}
              tooltipTitle="Ver detalles"
              buttonType="default"
              buttonShape="circle"
            />

            <ButtonCustom
              action={`/admin/vendedor/${userState[i].correo}`}
              icon={<EditOutlined />}
              tooltipTitle="Editar"
              buttonType="primary"
              buttonShape="circle"
            />
          </div>
        ),
      });
    }
  }

  useEffect(() => {
    dispatch(resetState());
    dispatch(getUsers());
  }, []);


  const showModal = (userId) => {
    setOpen(true);
    setUserId(userId);
  };

  const hideModal = () => {
    setOpen(false);
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = async (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  return (
    <div>
      <h3 className="mb-4 title">Lista de Vendedores</h3>
      <CustomTable columns={columns} dataSource={data1} />
    </div>
  );
};

export default withBodyClass(Empleadolist, 'body-admin');
