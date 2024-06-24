import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Typography } from "antd";
import { getAUser } from "../features/usuario/usuarioSlice";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/Botones.css"

const { Title } = Typography;

const VerCliente = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const getUserCorreo = location.pathname.split("/")[3];
  const user = useSelector((state) => state.user);
  const { nombre, cedula, correo, telefono, direccion } = user;

  const goBack = () => {
    navigate(-1);
  };

  const labelStyles = {
    fontWeight: "500",
    fontSize: "medium",
    margin: "13px 0",
    backgroundColor: "#e6e950", 
    color: "#0000000", 
    boxShadow: "0 4px 10px rgba(0, 21, 41, 0.3)", 
    padding: "2px 10px",
    borderRadius: "15px",
  };
  
  
  useEffect(() => {
    dispatch(getAUser(getUserCorreo));
  }, [dispatch, getUserCorreo]);

  return (
    <div>
      <h3 className="mb-4  title">Detalles del Cliente</h3>

      <div style={{ background: "#fff", padding: 24 }}>
        <div>
          <label style={labelStyles}>Cédula:</label>
          <h6 style={{ marginLeft: "10px" }}>{cedula}</h6>
          <label style={labelStyles}>Nombre:</label>
          <h6 style={{ marginLeft: "10px" }}>
            {nombre ? nombre.toUpperCase() : ""}
          </h6>
          <label style={labelStyles}>Correo electrónico:</label>
          <h6 style={{ marginLeft: "10px" }}>{correo}</h6>
          <label style={labelStyles}>Télefono:</label>
          <h6 style={{ marginLeft: "10px" }}>{telefono}</h6>
          <label style={labelStyles}>Dirección:</label>
          <h6 style={{ marginLeft: "10px" }}>{direccion}</h6>

          <button
            onClick={goBack}
            className="boton-bonito"
            >
            Regresar
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerCliente;
