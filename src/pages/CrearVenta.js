import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Select, Input, Button, Table } from "antd";
import CustomInput from "../components/CustomInput";
import { toast } from "react-toastify";
import * as yup from "yup";
import { useFormik } from "formik";
import { useNavigate, useLocation } from "react-router-dom";
import { getMarcasauto } from "../features/marca_auto/marcaautoSlice";
import { getUsers } from "../features/usuario/usuarioSlice";
import { getCategorias } from "../features/categoria/categoriaSlice";
import productService from "../features/producto/productoService";
import "../styles/Addproducts.css";
import {
  createProducts,
  resetState,
  updateAProduct,
  getAProduct,
  getProducts,
} from "../features/producto/productoSlice";
import { createVenta, getVenta, getVentas } from "../features/venta/ventaSlice";
import {
  getServiciomantrep,
  getServiciosmantrep,
} from "../features/serviciosmantrep/serviciosmantrepSlice";

const { Option } = Select;

// Esquema de validación Yup para el formulario de venta
const schema = yup.object().shape({
  id_cajera: yup.string().required("Cajera es requerida"),
  id_cliente: yup.string().required("Cliente es requerido"),
  total_venta: yup
    .number()
    .min(1, "El total de la venta debe ser mayor que cero")
    .required("Total de la venta es requerido"),
  metodo_pago: yup.string().required("Método de pago es requerido"),
  productos_vendidos: yup
    .array()
    .of(
      yup.object().shape({
        id_producto: yup.string().required("Producto es requerido"),
        nombre: yup.string().required("Nombre es requerido"),
        cantidad: yup
          .number()
          .min(1, "Cantidad debe ser mayor que cero")
          .required("Cantidad es requerida"),
        precio: yup
          .number()
          .min(1, "Precio debe ser mayor que cero")
          .required("Precio es requerido"),
      })
    )
    .min(1, "Debe seleccionar al menos un producto vendido"),
  servicios_prestados: yup
    .array()
    .of(
      yup.object().shape({
        id_servicio: yup.string().required("Servicio es requerido"),
        placaCarro: yup.string().required("Placa del carro es requerida"),
        id_mecanico: yup.string().required("Mecánico es requerido"),
        precio_manoDeObra: yup
          .number()
          .min(1, "Precio de mano de obra debe ser mayor que cero")
          .required("Precio de mano de obra es requerido"),
      })
    )
    .min(1, "Debe agregar al menos un servicio prestado"),
});

const CrearVenta = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
 

  const userState = useSelector((state) => state.user.users);
  const catState = useSelector((state) => state.categoria.categorias);
  const productoState = useSelector((state) => state.producto.products);
  const servicioState = useSelector(
    (state) => state.serviciosmantrep.servicios
  );

  useEffect(() => {
    dispatch(getCategorias());
    dispatch(getUsers());
    dispatch(getProducts());
    dispatch(getServiciosmantrep());
  }, [dispatch]);

  const newventa = useSelector((state) => state.venta);
  const { isSuccess, isError, isLoading, isExisting, createdVenta } = newventa;

  const handleAgregarVenta = () => {
    formik.handleSubmit();
  };

  useEffect(() => {
    if (isSuccess && createdVenta && !isExisting) {
      toast.success("Producto agregado exitosamente!");
      formik.resetForm();
    }
    if (isError && !isExisting) {
      toast.error("Algo salio mal!");
    }

    if (isExisting) {
      toast.error(
        "¡El producto ya existe por favor verifica la referencia o el nombre.!"
      );
    }
  }, [isSuccess, isError, isLoading, isExisting]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      id_cajera: "", 
      id_cliente: "", 
      total_venta: 0, 
      metodo_pago: "", 
      productos_vendidos: [], 
      servicios_prestados: [], 
    },
    validationSchema: schema,
    onSubmit: (values) => {
        dispatch(createVenta(values));
        setTimeout(() => {
          dispatch(resetState());
          dispatch(getUsers());
          dispatch(getCategorias());
          dispatch(getServiciosmantrep());
          dispatch(getProducts());
        }, 3000);
    },
});

  const [nombreProducto, setNombreProducto] = useState("");
  const [precioProducto, setPrecioProducto] = useState(0);
  const [cantidadProducto, setCantidadProducto] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [editingServicioId, seteditingServicioId] = useState(null);
  const [editingMecanicoId, seteditingMecanicoId] = useState(null);
  const [nombreServicio, setNombreServicio] = useState("");
  const [precioManoDeObra, setPrecioManoDeObra] = useState(0);
  const [placaCarro, setPlacaCarro] = useState(0);

  
  const handleAgregarProducto = () => {
    if (nombreProducto && precioProducto > 0 && cantidadProducto > 0) {
      const productoEncontrado = productoState.find(
        (prod) => prod._id === nombreProducto
      );
       console.log("nombre", nombreProducto);
       console.log("aaaaaaaaaa", productoState);
      
      if (productoEncontrado) {
        const producto = {
          id_producto: isEditing ? editingProductId : productoEncontrado._id,
          nombre: productoEncontrado.nombre,
          cantidad: cantidadProducto,
          precio: precioProducto,
        };

        if (isEditing) {
          const updatedProductos = formik.values.productos_vendidos.map(
            (prod) =>
              prod.id_producto === editingProductId ? producto : prod
          );
          formik.setFieldValue("productos_vendidos", updatedProductos);
          setIsEditing(false);
          setEditingProductId(null);
        } else {
          formik.setFieldValue("productos_vendidos", [
            ...formik.values.productos_vendidos,
            producto,
          ]);
        }

        setNombreProducto("");
        setPrecioProducto(0);
        setCantidadProducto(1);
      } else {
        toast.error("Producto no encontrado");
      }
    }
  };

  const handleAgregarServicio = () => {
    if (nombreServicio && precioManoDeObra > 0 && placaCarro) {
      const servicioEncontrado = servicioState.find(
        (ser) => ser._id === nombreServicio
      );
      const mecanicoEncontrado = userState.find(
        (user) => user._id === formik.values.id_mecanico
      );
  
      if (servicioEncontrado && mecanicoEncontrado) {
        const servicio = {
          id_servicio: isEditing ? editingServicioId : servicioEncontrado._id,
          id_mecanico: isEditing ? editingMecanicoId : formik.values.id_mecanico,
          placaCarro: placaCarro,
          precio_manoDeObra: precioManoDeObra,
        };
  
        if (isEditing) {
          const updatedServicios = formik.values.servicios_prestados.map(
            (ser) => (ser.id_servicio === editingServicioId ? servicio : ser)
          );
          formik.setFieldValue("servicios_prestados", updatedServicios);
          setIsEditing(false);
          setEditingProductId(null);
        } else {
          formik.setFieldValue("servicios_prestados", [
            ...formik.values.servicios_prestados,
            servicio,
          ]);
        }
  
        setPlacaCarro(0);
        setPrecioManoDeObra(0);
      } else {
        toast.error("Servicio o mecánico no encontrado");
      }
    } else {
      toast.error("Por favor ingrese la placa del carro");
    }
  };
  

  const handleEditarProducto = (producto) => {
    setNombreProducto(producto.id_producto);
    setPrecioProducto(producto.precio);
    setCantidadProducto(producto.cantidad);
    setIsEditing(true);
    setEditingProductId(producto.id_producto);
  };

  const handleEliminarProducto = (id_producto) => {
    const updatedProductos = formik.values.productos_vendidos.filter(
      (producto) => producto.id_producto !== id_producto
    );
    formik.setFieldValue("productos_vendidos", updatedProductos);
  };

  const handlePlacaCarroChange = (e) => {
    setPlacaCarro(e.target.value);
  };

  return (
    <div className="formulario_productos">
      <h3 className="mb-4 title">
         Agregar Venta
        {console.log("formik", formik.values)}
      </h3>

      <div>
        <form
         onSubmit={formik.handleSubmit}
          className="d-flex gap-3 flex-column"
        >
          <section className="form_section">
            <div className="form_data">
              <label>Cajera</label>
              <Select
                showSearch
                placeholder="Selecciona una cajera"
                optionFilterProp="children"
                value={formik.values.id_cajera}
                onChange={(value) => formik.setFieldValue("id_cajera", value)}
                onBlur={formik.handleBlur("id_cajera")}
                style={{ width: "100%" }}
              >
                {userState.map((user) => {
                  if (user.id_rol === "6669074f41dcdb08eee0128e") {
                    return (
                      <Option
                        key={user._id}
                        value={user._id}
                        disabled={!user.activo}
                      >
                        {user.nombre}
                      </Option>
                    );
                  } else {
                    return null;
                  }
                })}
              </Select>
              {formik.touched.id_cajera && formik.errors.id_cajera && (
                <div className="error_message">{formik.errors.id_cajera}</div>
              )}

              <label>Cliente</label>
              <Select
                showSearch
                placeholder="Selecciona un cliente"
                optionFilterProp="children"
                value={formik.values.id_cliente}
                onChange={(value) => formik.setFieldValue("id_cliente", value)}
                onBlur={formik.handleBlur("id_cliente")}
                style={{ width: "100%" }}
              >
                {userState.map((user) => {
                  if (user.id_rol === "666e14291f37b8e8b13ad363") {
                    return (
                      <Option
                        key={user._id}
                        value={user._id}
                        disabled={!user.activo}
                      >
                        {user.nombre}
                      </Option>
                    );
                  } else {
                    return null;
                  }
                })}
              </Select>
              {formik.touched.id_cliente && formik.errors.id_cliente && (
                <div className="error_message">{formik.errors.id_cliente}</div>
              )}

              <label>Total Venta</label>
              <Input
                type="number"
                name="total_venta"
                onChange={formik.handleChange("total_venta")}
                onBlur={formik.handleBlur("total_venta")}
                value={formik.values.total_venta}
              />
              {formik.touched.total_venta && formik.errors.total_venta && (
                <div className="error_message">{formik.errors.total_venta}</div>
              )}

              <label>Método de Pago</label>
              <Select
                placeholder="Selecciona un método de pago"
                value={formik.values.metodo_pago}
                onChange={(value) => formik.setFieldValue("metodo_pago", value)}
                onBlur={formik.handleBlur("metodo_pago")}
                style={{ width: "100%" }}
              >
                <Option value="Efectivo">Efectivo</Option>
                <Option value="Tarjeta">Tarjeta</Option>
                <Option value="Transferencia">Transferencia</Option>
              </Select>
              {formik.touched.metodo_pago && formik.errors.metodo_pago && (
                <div className="error_message">{formik.errors.metodo_pago}</div>
              )}
            </div>
          </section>
          {console.log("AAAAAAAAAAAAAAAAAAa", nombreProducto)}
          <section className="form_section">
            <div className="form_data">
              <h4>Productos Vendidos</h4>
              <label>Nombre del Producto</label>
              <Select
                showSearch
                placeholder="Selecciona un producto"
                optionFilterProp="children"
                value={nombreProducto}
                onChange={(value) => {
                  setNombreProducto(value);
                  const producto = productoState.find(
                    (prod) => prod._id === value
                  );
                  if (producto) {
                    setPrecioProducto(producto.precio);
                  }
                }}
                style={{ width: "100%" }}
              >
                {productoState.map((producto) => (
                  <Option key={producto._id} value={producto._id}>
                    {producto.nombre}
                  </Option>
                ))}
              </Select>

              <label>Cantidad</label>
              <Input
                type="number"
                value={cantidadProducto}
                onChange={(e) => setCantidadProducto(Number(e.target.value))}
                min="1"
              />

              <label>Precio</label>
              <Input
                type="number"
                value={precioProducto}
                onChange={(e) => setPrecioProducto(Number(e.target.value))}
                min="1"
                disabled
              />

              <Button
                type="primary"
                onClick={handleAgregarProducto}
                style={{ marginTop: "10px" }}
              >
                {isEditing ? "Actualizar Producto" : "Agregar Producto"}
              </Button>

              <Table
                dataSource={formik.values.productos_vendidos}
                columns={[
                  {
                    title: "Nombre",
                    dataIndex: "nombre",
                    key: "nombre",
                  },
                  {
                    title: "Cantidad",
                    dataIndex: "cantidad",
                    key: "cantidad",
                  },
                  {
                    title: "Precio Unitario",
                    dataIndex: "precio",
                    key: "precio",
                  },
                  {
                    title: "Total",
                    key: "total",
                    render: (text, record) => (
                      <span>{record.precio * record.cantidad}</span>
                    ),
                  },
                  {
                    title: "Acciones",
                    key: "acciones",
                    render: (text, record) => (
                      <div>
                        <Button
                          type="link"
                          onClick={() => handleEditarProducto(record)}
                        >
                          Editar
                        </Button>
                        <Button
                          type="link"
                          danger
                          onClick={() =>
                            handleEliminarProducto(record.id_producto)
                          }
                        >
                          Eliminar
                        </Button>
                      </div>
                    ),
                  },
                ]}
                rowKey="id_producto"
                style={{ marginTop: "20px" }}
              />
            </div>
          </section>

          <section className="form_section">
            <div className="form_data">
              <h4>Servicios</h4>
              <label>Nombre del Servicio</label>
              <Select
                showSearch
                placeholder="Selecciona un servicio"
                optionFilterProp="children"
                value={nombreServicio}
                onChange={(value) => {
                  setNombreServicio(value);
                  const servicio = servicioState.find(
                    (ser) => ser._id === value
                  );
                  if (servicio) {
                    setPrecioManoDeObra(servicio.precio);
                  }
                }}
                style={{ width: "100%" }}
              >
                {servicioState.map((servicio) => (
                  <Option key={servicio._id} value={servicio._id}>
                    {servicio.nombre}
                  </Option>
                ))}
              </Select>

              <label>Nombre del Mecanico</label>
              <Select
                showSearch
                placeholder="Selecciona un Mecanico"
                optionFilterProp="children"
                value={formik.values.id_mecanico}
                onChange={(value) => formik.setFieldValue("id_mecanico", value)}
                onBlur={formik.handleBlur("id_mecanico")}
                style={{ width: "100%" }}
              >
                {userState.map((user) => {
                  if (user.id_rol === "6669075e41dcdb08eee01291") {
                    return (
                      <Option
                        key={user._id}
                        value={user._id}
                        disabled={!user.activo}
                      >
                        {user.nombre}
                      </Option>
                    );
                  } else {
                    return null;
                  }
                })}
              </Select>
              {formik.touched.id_mecanico && formik.errors.id_mecanico && (
                <div className="error_message">{formik.errors.id_mecanico}</div>
              )}

              <label>Placa Carro</label>
              <Input
                type="number"
                value={placaCarro}
                onChange={(e) => setPlacaCarro(Number(e.target.value))}
                min="1"
              />

              <label>Precio Mano de Obra</label>
              <Input
                type="number"
                value={precioManoDeObra}
                onChange={(e) => setPrecioManoDeObra(Number(e.target.value))}
                min="1"
              />


              <Button
                type="primary"
                onClick={handleAgregarServicio}
                style={{ marginTop: "10px" }}
              >
                {isEditing ? "Actualizar Producto" : "Agregar Producto"}
              </Button>

              <Table
                dataSource={formik.values.servicios_prestados }
                columns={[
                  {
                    title: "Nombre del servicio",
                    dataIndex: "id_servicio",
                    key: "id_servicio",
                    render: (id_servicio) => {
                        const servicio = servicioState.find(ser => ser._id === id_servicio);
                        return servicio ? servicio.nombre : 'Servicio no encontrado';
                      },
                  },
                  {
                    title: "Placa Carro",
                    dataIndex: "placaCarro",
                    key: "placaCarro",
                  },
                  {
                    title: "Precio Mano de Obra",
                    dataIndex: "precio_manoDeObra",
                    key: "precio_manoDeObra",
                  },
                  {
                    title: "Total",
                    key: "total",
                    render: (text, record) => (
                      <span>{record.precio_manoDeObra}</span>
                    ),
                  },
                  {
                    title: "Acciones",
                    key: "acciones",
                    render: (text, record) => (
                      <div>
                        <Button
                          type="link"
                          onClick={() => handleEditarProducto(record)}
                        >
                          Editar
                        </Button>
                        <Button
                          type="link"
                          danger
                          onClick={() =>
                            handleEliminarProducto(record.id_producto)
                          }
                        >
                          Eliminar
                        </Button>
                      </div>
                    ),
                  },
                ]}
                rowKey="id_producto"
                style={{ marginTop: "20px" }}
              />
            </div>
          </section>

          <Button
          className="btn btn-success border-0 rounded-3 my-5"
          type="button"
          onClick={handleAgregarVenta}
        >
           AgregarVenta
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CrearVenta;
