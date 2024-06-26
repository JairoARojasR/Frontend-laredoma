import React, { useEffect, useState } from "react";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { SiMazda } from "react-icons/si";
import { FaUser, FaTshirt, FaUserTag } from "react-icons/fa";
import axios from "axios";
import { FaListCheck, FaClipboardList } from "react-icons/fa6";
import { GiMechanicGarage } from "react-icons/gi";
import { HiMiniBellAlert } from "react-icons/hi2";

import {
  MdOutlineDashboardCustomize,
  MdOutlineInventory,
  MdCampaign,
  MdOutlineFormatColorFill,
  MdElectricCar,
} from "react-icons/md";
import { RiDashboardFill } from "react-icons/ri";
import { TiThList } from "react-icons/ti";
import { FaUsers } from "react-icons/fa";
//import "./MainLayout.module.css";
//import "../styles/custom.css"
import { config } from "../utils/axiosconfig";
import { base_url } from "../utils/baseUrl";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useLocation } from "react-router-dom";
import userService from "../features/usuario/usuarioService";
import { Outlet } from "react-router-dom";
import { IoIosNotifications, IoMdListBox } from "react-icons/io";
import {
  BiSolidCarMechanic,
  BiSolidCategory,
  BiSolidCarBattery,
} from "react-icons/bi";
import { Layout, Menu, theme, Avatar, Badge, message } from "antd";
import { useNavigate } from "react-router-dom";

import userSvg from "../images/user-solid.svg";
import "../styles/custom.css";
const { Header, Sider, Content } = Layout;

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [userData, setUserData] = useState({ name: "", email: "" });
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const navigate = useNavigate();
  const location = useLocation();
  const [count, setCount] = useState(0);

  const handleLogoutClick = async () => {
    try {
      await userService.logoutUser();
      return navigate("/");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = config.headers.Authorization.split(" ")[1];
        if (token) {
          const response = await axios.get(
            `${base_url}persona/getTokenData/${token}`
          );
          const correo = response.data.data.correo;
          const nombre = response.data.data.nombre;
          setUserData({ email: correo, name: nombre });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Función asíncrona para obtener el número de notificaciones no leídas
    const fetchNotificacionesCount = async () => {
      try {
        const response = await axios.get(`${base_url}notificaciones/count`);
        // Actualiza el estado 'count' con el número de notificaciones no leídas
        setCount(response.data.noLeidas);
      } catch (error) {
        console.error("Error fetching notificaciones count", error);
      }
    };

    // Llama a la función una vez cuando el componente se monta
    fetchNotificacionesCount();

    // Establece un intervalo para llamar a la función periódicamente
    const intervalId = setInterval(fetchNotificacionesCount, 3000); // 60000 ms = 1 minuto

    // Limpia el intervalo cuando el componente se desmonte
    return () => clearInterval(intervalId);
  }, [base_url]);

  const handleClick = async () => {
    try {
      await axios.patch(`${base_url}notificaciones/marcar-todas-leidas`);
      message.success(
        "Todas las notificaciones han sido marcadas como leídas."
      );
      setCount(0); // Actualizar el contador a 0 ya que todas las notificaciones ahora están leídas
    } catch (error) {
      console.error("Error marking all notifications as read", error);
      message.error("Error al marcar todas las notificaciones como leídas");
    }
  };

  //  useEffect(() => {
  //   const token = localStorage.getItem("user");

  //   if (!token && location.pathname ==="/admin" && location.pathname !== "/login") {
  //     navigate("/login");
  //   }
  // }, [location, navigate]);

  return (
    <Layout onContextMenu={(e) => e.preventDefault()}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="logo">
          <h2 className="text-white fs-5 text-center py-3 mb-0">
            {collapsed ? (
              <h3>A&S</h3>
            ) : (
              <>
                <span className="lg-logo">A&S LA REDOMA</span>
              </>
            )}
          </h2>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={[""]}
          onClick={({ key }) => {
            if (key === "signout") {
              handleLogoutClick();
            } else {
              navigate(key);
            }
          }}
          items={[
            {
              key: "customers",
              icon: <FaUserTag className="fs-4" />,
              label: "Clientes",
              children: [
                {
                  key: "usuarios",
                  icon: <FaUsers className="fs-4" />,
                  label: "Lista de Clientes",
                },
              ],
            },

            {
              key: "empleados",
              icon: <FaUser className="fs-4" />,
              label: "Empleados",
              children: [
                {
                  key: "empleado",
                  icon: <FaUsers className="fs-4" />,
                  label: "Agregar Empleado",
                },

                {
                  key: "lista-empleados",
                  icon: <FaUsers className="fs-4" />,
                  label: "Lista de Empleados",
                },

                {
                  key: "lista-roles",
                  icon: <FaUsers className="fs-4" />,
                  label: "Lista de Roles",
                },
              ],
            },

            {
              key: "proveedores",
              icon: <FaUser className="fs-4" />,
              label: "Proveedor",
              children: [
                {
                  key: "proveedor",
                  icon: <FaUsers className="fs-4" />,
                  label: "Agregar proveedor",
                },

                {
                  key: "lista-proveedores",
                  icon: <FaUsers className="fs-4" />,
                  label: "Lista de proveedores",
                },
              ],
            },

            {
              key: "Catalog",
              icon: <MdOutlineInventory className="fs-4" />,
              label: "Inventario",
              children: [
                {
                  key: "producto",
                  icon: <BiSolidCarBattery className="fs-4" />,
                  label: "Agregar Productos",
                },
                {
                  key: "lista-productos",
                  icon: <FaClipboardList className="fs-4" />,
                  label: "Lista de Productos",
                },
                // {
                //   key: "categoria",
                //   icon: <RiDashboardFill className="fs-4" />,
                //   label: "Agregar Categorias",
                // },
                {
                  key: "lista-categorias",
                  icon: <BiSolidCategory className="fs-4" />,
                  label: "Categorias",
                },
                {
                  key: "lista-marcas-de-autos",
                  icon: <SiMazda className="fs-4" />,
                  label: "Marcas de Autos",
                },
                {
                  key: "lista-servicios-mantenimiento-y-reparacion",
                  icon: <BiSolidCarMechanic className="fs-4" />,
                  label: "Servicios de Mantenimiento y Reparacion",
                },
              ],
            },

            {
              key: "venta",
              icon: <GiMechanicGarage className="fs-4" />,
              label: "Ventas",
              children: [
                {
                  key: "ventas",
                  icon: <FaUsers className="fs-4" />,
                  label: "Agregar Ventas",
                },
                {
                  key: "lista-venta",
                  icon: <FaUsers className="fs-4" />,
                  label: "Lista de Ventas",
                },
                {
                  key: "resumen",
                  icon: <FaUsers className="fs-4" />,
                  label: "Resumen Ventas",
                },
              ],
            },
          ]}
        />
      </Sider>
      <Layout className="site-layout">
        <Header
          className="d-flex justify-content-between ps-1 pe-5"
          style={{
            padding: 0,
            background: "#E6E950",
            boxShadow: "0px 3px 8px rgba(0, 0, 0, 0.24)",
          }}
        >
          {React.createElement(
            collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
            {
              className: "trigger",
              onClick: () => setCollapsed(!collapsed),
            }
          )}
          <div className="d-flex gap-4 align-items-center">
            <Link to="/admin/ver-Notificaciones" onClick={handleClick}>
              <Badge count={count}>
                <Avatar
                  shape="square"
                  size="large"
                  icon={<HiMiniBellAlert />}
                />
              </Badge>
            </Link>
            <div className="d-flex gap-3 align-items-center dropdown">
              <div>
                <img width={32} height={32} src={userSvg} alt="" />
              </div>
              <div
                role="button"
                id="dropdownMenuLink"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <h5 className="mb-0">{userData.name}</h5>
                <p className="mb-0">{userData.email}</p>
              </div>
              <div className="dropdown-menu" aria-labelledby="dropdownMenuLink">
                <li>
                  <Link
                    className="dropdown-item py-1 mb-1"
                    style={{ height: "auto", lineHeight: "20px" }}
                    to="/admin/ver-Perfil"
                  >
                    Ver Perfil
                  </Link>
                </li>
                <li>
                  <Link
                    className="dropdown-item py-1 mb-1"
                    style={{ height: "auto", lineHeight: "20px" }}
                    onClick={handleLogoutClick}
                    to="/"
                  >
                    Salir
                  </Link>
                </li>
              </div>
            </div>
          </div>
        </Header>
        <Content
          style={{
            margin: "5px 5px",
            padding: 24,
            minHeight: 500,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};
export default MainLayout;
