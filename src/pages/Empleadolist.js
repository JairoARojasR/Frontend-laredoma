import React, { useEffect, useState, useRef } from "react";
import { Button, Flex, Tooltip, Switch, Tabs, Space, Input } from "antd";
import Highlighter from "react-highlight-words";
import CustomTable from "../components/CustomTable";
import CustomModal from "../components/CustomModal";
import withBodyClass from "../components/wrapper";
import "../styles/Body.pages.css"
import { useDispatch, useSelector } from "react-redux";
import ButtonCustom from "../components/ButtonCustom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import usuarioService from "../features/usuario/usuarioService"
import { getRoles } from "../features/rol/rolSlice";
import {
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";
import {
  getUsers,
  resetState,
  deleteAUser,
  updateAUser,
} from "../features/usuario/usuarioSlice";
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
  const [selectedEmpleado, setselectedEmpleado] = useState("6669074f41dcdb08eee0128e");
  const searchInput = useRef(null);
  const dispatch = useDispatch();

  const userState = useSelector((state) => state.user.users) || [];
  const rolState = useSelector((state) => state.rol.roles);

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

  const getDataByRole = (roleId) => {
    return userState
      .filter(user => user.id_rol === roleId)
      .map((user, index) => ({
        key: index + 1,
        nombre: user.nombre,
        cedula: user.cedula,
        correo: user.correo,
        rol: user.id_rol,
        contrasenia: user.contrasenia,
        activo: (
          <Space direction="vertical">
            <Switch
              checkedChildren={<CheckOutlined />}
              unCheckedChildren={<CloseOutlined />}
              defaultChecked={user.activo}
              onChange={(checked) => handleSwitchChange(user._id, 'activo', checked)}
            />
          </Space>
        ),
        action: (
          <div className="button-container">
            <ButtonCustom
              action={`/admin/ver-empleado/${user._id}`}
              icon={<EyeOutlined />}
              tooltipTitle="Ver detalles"
              buttonType="default"
              buttonShape="circle"
            />

            <ButtonCustom
              action={`/admin/empleado/${user._id}`}
              icon={<EditOutlined />}
              tooltipTitle="Editar"
              buttonType="primary"
              buttonShape="circle"
            />
          </div>
        ),
      }));
  };

  useEffect(() => {
    dispatch(resetState());
    dispatch(getUsers());
    dispatch(getRoles());
  }, [dispatch]);

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

  const onChangeTab = (key) => {
    setselectedEmpleado(key);
  };

  const items = rolState
  .filter((role) => role.nombre !== "Cliente" && role.nombre !== "Proveedor") 
  .map((role) => ({
    key: role._id,
    label: role.nombre,
    children: <CustomTable columns={columns} dataSource={getDataByRole(role._id)} />,
  }));


  return (
    <div>
      <h3 className="mb-4 title">Lista de Empleados</h3>
      <Tabs defaultActiveKey="6669074f41dcdb08eee0128e" items={items} onChange={onChangeTab} />
    </div>
  );
};

export default withBodyClass(Empleadolist, 'body-admin');
