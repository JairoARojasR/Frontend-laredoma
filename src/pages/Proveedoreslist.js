
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
  },

  {
    title: "Correo",
    dataIndex: "correo",
  },

  {
    title: "Estado",
    dataIndex: "estado",
  },
  {
    title: "Acciones",
    dataIndex: "action",
  },
];

const Proveedoreslist = () => {
  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState("");
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const dispatch = useDispatch();

  const userState = useSelector((state) => state.user.users);
  const [setData1] = useState([]);

  const handleSwitchChange = async (userId, property, checked) => {
    try {
      await usuarioService.updateUser({
        id: userId,
        userData: {
          [property]: checked,
        },
      });
      dispatch(getUsers());

      const message = checked
        ? `El Empleado está ${property} actualmente`
        : `El Elmpleado no está ${property} actualmente`;

      toast.success(message);
      
    } catch (error) {
      const errorMessage = `Error al cambiar el estado de ${property} del Empleado NO tienes los permisos Necesarios`;
      toast.error(errorMessage);
    }
  };

  const data1 = [];
  for (let i = 0; i < userState.length; i++) {
    if (userState[i].id_rol === "6667c97dbb2265c8a8eba941") {
      data1.push({
        key: i + 1,
        nombre: userState[i].nombre,
        cedula: userState[i].cedula,
        correo: userState[i].correo,
        rol: userState[i].rol,
        contrasenia: userState[i].contrasenia,
        estado: (
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
              action={`/admin/ver-proveedor/${userState[i]._id}`}
              icon={<EyeOutlined />}
              tooltipTitle="Ver detalles"
              buttonType="default"
              buttonShape="circle"
            />

            <ButtonCustom
              action={`/admin/proveedor/${userState[i]._id}`}
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
      <h3 className="mb-4 title">Lista de Proveedores</h3>
      <CustomTable columns={columns} dataSource={data1} />
    </div>
  );
};

export default withBodyClass(Proveedoreslist, 'body-admin');