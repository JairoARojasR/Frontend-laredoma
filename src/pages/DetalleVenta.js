import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { getVenta, getVentas, resetState } from "../features/venta/ventaSlice";
import { getUsers } from "../features/usuario/usuarioSlice";
import dayjs from "dayjs";
import { getAProduct, getProducts } from "../features/producto/productoSlice";
import {
  getServiciomantrep,
  getServiciosmantrep,
} from "../features/serviciosmantrep/serviciosmantrepSlice";
import "../styles/DetalleVenta.css";

const DetalleVenta = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const ventaId = location.pathname.split("/")[3];

  const ventaState = useSelector((state) => state.venta.ventas);
  const productoState = useSelector((state) => state.producto.products);
  const userState = useSelector((state) => state.user.users);
  const servicioState = useSelector(
    (state) => state.serviciosmantrep.servicios
  );

  useEffect(() => {
    if (ventaId !== undefined) {
      dispatch(getVenta(ventaId));
    } else {
      dispatch(resetState());
    }
  }, [ventaId, dispatch]);

  useEffect(() => {
    dispatch(getUsers());
    dispatch(getVentas());
    dispatch(getProducts());
    dispatch(getServiciosmantrep());
  }, [dispatch]);

  const goBack = () => {
    navigate(-1);
  };

  const getNombreProducto = (idProducto) => {
    const product = productoState.find((prod) => prod._id === idProducto);
    return product ? product.nombre : "Producto no encontrado";
  };

  const getNombreUsuario = (idusuario) => {
    const user = userState.find((user) => user._id === idusuario);
    return user ? user.nombre : "Usuario no encontrado";
  };

  const getNombreServicio = (idservicio) => {
    const servicio = servicioState.find(
      (servicio) => servicio._id === idservicio
    );
    return servicio ? servicio.nombre : "Servicio no encontrado";
  };

  const venta = ventaState.find((v) => v.venta._id === ventaId);

  return (
    <div className="detalle-venta-container">
      <div className="header">
        <h3 className="title">Detalle de Venta</h3>
      </div>
      {venta && (
        <div className="venta-info">
          <div className="section">
            <h4>Venta:</h4>
            <p>
              <strong>Nombre Cajera:</strong>{" "}
              {getNombreUsuario(venta.venta.id_cajera)}
            </p>
            <p>
              <strong>Nombre Cliente:</strong>{" "}
              {getNombreUsuario(venta.venta.id_cliente)}
            </p>
            <p>
              <strong>Total Venta:</strong> {venta.venta.total_venta}
            </p>
            <p>
              <strong>Método de Pago:</strong> {venta.venta.metodo_pago}
            </p>
            <p>
              <strong>Fecha:</strong>{" "}
              {dayjs(venta.venta.fecha).format("DD-MM-YYYY")}
            </p>
          </div>

          {venta.productos_vendidos.length > 0 && (
            <div className="section">
              <h4>Productos Vendidos:</h4>
              {venta.productos_vendidos.map((producto, index) => (
                <div key={index} className="item">
                  <p>
                    <strong>Nombre Producto:</strong>{" "}
                    {getNombreProducto(producto.id_producto)}
                  </p>
                  <p>
                    <strong>Cantidad:</strong> {producto.cantidad}
                  </p>
                  <p>
                    <strong>Precio Unitario:</strong> {producto.precio}
                  </p>
                </div>
              ))}
            </div>
          )}

          {venta.servicios_prestados.length > 0 && (
            <div className="section">
              <h4>Servicios Prestados:</h4>
              {venta.servicios_prestados.map((servicio, index) => (
                <div key={index} className="item">
                  <p>
                    <strong>ID Servicio:</strong>{" "}
                    {getNombreServicio(servicio.id_servicio)}
                  </p>
                  <p>
                    <strong>Placa del Carro:</strong> {servicio.placaCarro}
                  </p>
                  <p>
                    <strong>Precio Mano de Obra:</strong>{" "}
                    {servicio.precio_manoDeObra}
                  </p>
                </div>
              ))}
            </div>
          )}

          <button className="volver-button" onClick={goBack}>
            Volver
          </button>
        </div>
      )}
    </div>
  );
};

export default DetalleVenta;
