import React, { useEffect, useState, useRef } from "react";
import { Button, Flex, Tooltip } from "antd";
import { Input, Space } from "antd";
import Highlighter from "react-highlight-words";
import CustomTable from "../components/CustomTable";
import CustomModal from "../components/CustomModal";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { toast } from "react-toastify";
import {
    getUsers,
    resetState,
    deleteAUser,
} from "../features/usuario/usuarioSlice";
import { Link } from "react-router-dom";
import {
    SearchOutlined,
    EditOutlined,
    EyeOutlined,
    DeleteOutlined,
} from "@ant-design/icons";

import "../styles/custom.css";

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
        title: "Acciones",
        dataIndex: "action",
    },
];


const Userlist = () => {
    const [open, setOpen] = useState(false);
    const [userId, setUserId] = useState("");
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const searchInput = useRef(null);
    const dispatch = useDispatch();

    const userState = useSelector((state) => state.user.users);
    const data1 = [];

    useEffect(() => {
        dispatch(resetState());
        dispatch(getUsers());

    }, []);

    if (userState !== null) {
        for (let i = 0; i < userState.length; i++) {
                data1.push({
                    key: i + 1,
                    nombre: userState[i].nombre,
                    cedula: userState[i].cedula,
                    correo: userState[i].correo,
                    rol: userState[i].rol,
                    estado: userState[i].estado,
                    action: (
                        <Link
                            to={`/admin/ver-cliente/${userState[i].correo}`}
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
                    ),
                });
            
        }
    }

    const deleteUser = async (userId) => {
        await dispatch(deleteAUser(userId));
        setOpen(false);
        dispatch(getUsers());
        toast.success("Producto eliminado exitosamente!");
    };

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
         
            <h3 className="mb-4 title">Lista de Clientes</h3>
            <CustomTable columns={columns} dataSource={data1} />
            <CustomModal
                hideModal={hideModal}
                open={open}
                performAction={() => {
                    deleteUser(userId);
                }}
                title="¿Estás seguro/a de que deseas eliminar este producto?"
            />
        </div>
    );
};

export default Userlist;
