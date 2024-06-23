import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Typography } from "antd";
import { getAUser } from "../features/usuario/usuarioSlice";
import { useLocation, useNavigate } from "react-router-dom";
import { getUsers } from "../features/usuario/usuarioSlice";
import { getRoles } from "../features/rol/rolSlice";



const { Title } = Typography;

const VerEmpleado = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const getUserCorreo = location.pathname.split("/")[3];
  const user = useSelector((state) => state.user);
  const userState = useSelector((state) => state.user.users);
  const rolState = useSelector((state) => state.rol.roles);

  

  const { nombre, cedula, correo, telefono, id_rol, permisos, fecha_contratacion, fecha_despido, direccion } = user;

  const goBack = () => {
    navigate(-1);
  };

  const labelStyles = {
    fontWeight: '500',
    fontSize: 'medium',
    margin: '13px 0',
    backgroundColor: '#E7E9FE',
    padding: '2px 10px',
    borderRadius: '15px'
  }

  useEffect(() => {
    dispatch(getAUser(getUserCorreo));
    dispatch(getUsers());
    dispatch(getRoles());
  }, [dispatch, getUserCorreo]);


  const getRolUsuario = (idusuario) => {
    const user = rolState.find((rol) => rol._id === idusuario);
    return user ? user.nombre : "Usuario no encontrado";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1; // Los meses son base 0, así que sumamos 1
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div>
      <h3 className="mb-4 title">Detalles del Empleado</h3>

      <div style={{ background: "#fff", padding: 24 }}>
        <div>
          {id_rol && (
            <>
              <label style={labelStyles}>Roles:</label>
              <h6 style={{ marginLeft: "10px" }}>{getRolUsuario(id_rol)}</h6>
            </>
          )}
          {nombre && (
            <>
              <label style={labelStyles}>Nombre:</label>
              <h6 style={{ marginLeft: "10px" }}>{nombre.toUpperCase()}</h6>
            </>
          )}
          {cedula && (
            <>
              <label style={labelStyles}>Cédula:</label>
              <h6 style={{ marginLeft: "10px" }}>{cedula}</h6>
            </>
          )}
          {correo && (
            <>
              <label style={labelStyles}>Correo electrónico:</label>
              <h6 style={{ marginLeft: "10px" }}>{correo}</h6>
            </>
          )}
          {telefono && (
            <>
              <label style={labelStyles}>Telefono:</label>
              <h6 style={{ marginLeft: "10px" }}>{telefono}</h6>
            </>
          )}
          {direccion && (
            <>
              <label style={labelStyles}>Dirección:</label>
              <h6 style={{ marginLeft: "10px" }}>{direccion}</h6>
            </>
          )}
          {fecha_contratacion && (
            <>
              <label style={labelStyles}>Fecha Contratación:</label>
              <h6 style={{ marginLeft: "10px" }}>{formatDate(fecha_contratacion)}</h6>
            </>
          )}
          {fecha_despido && (
            <>
              <label style={labelStyles}>Fecha Despido:</label>
              <h6 style={{ marginLeft: "10px" }}>{formatDate(fecha_despido)}</h6>
            </>
          )}
          <button
            onClick={goBack}
            className="btn btn-success border-0 rounded-3 my-5"
          >
            Regresar
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerEmpleado;