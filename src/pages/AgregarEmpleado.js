import React, { useEffect } from "react";
import CustomInput from "../components/CustomInput";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Button, Form, Input, DatePicker, Typography, message, Select} from "antd";
import * as yup from "yup";
import { useFormik } from "formik";
import {
  createProveedor,
  createEmpleado,
  getAUser,
  resetState,
  updateAUser,
} from "../features/usuario/usuarioSlice";
import dayjs from "dayjs";
import "dayjs/locale/es";

dayjs.locale("es");

let schema = yup.object().shape({
  nombre: yup
    .string()
    .required("El nombre del vendedor es obligatorio")
    .matches(
      /^[A-Za-záéíóúüñÁÉÍÓÚÜÑ\s]+$/,
      "El nombre solo puede contener letras"
    ),
  cedula: yup
    .string()
    .required("La cedula del vendedor es obligatoria")
    .matches(/^\d{7,10}$/, "La cedula debe tener entre 7 y 10 dígitos"),
  correo: yup
    .string()
    .email("El correo debe ser un email válido")
    .required("El correo del vendedor es obligatorio"),
});

const capitalizeFirstLetter = (word) => {
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
};

const labelStyles = {
  fontWeight: "500",
  fontSize: "medium",
  margin: "13px 0",
  backgroundColor: "#E7E9FE",
  padding: "2px 10px",
  borderRadius: "15px",
};

const { Option } = Select;

const AgregarEmpleado = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const getUserId = location.pathname.split("/")[3];
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  const {
    isSuccess,
    isError,
    isLoading,
    message,
    isExisting,
    createdUser,
    nombre,
    correo,
    cedula,
    direccion,
    contrasenia,
    fecha_contratacion,
    telefono,
    fecha_despido,
    motivo,
    id_rol,
    updatedUser,
  } = user;

  const goBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    if (getUserId !== undefined) {
      dispatch(getAUser(getUserId));
    } else {
      dispatch(resetState());
    }
  }, [getUserId]);

  useEffect(() => {
    if (isSuccess && createdUser && !isExisting) {
      toast.success("Proveedor agregado exitosamente!");
    }
    if (isSuccess && updatedUser) {
      toast.success("Proveedor actualizado exitosamente!");
      //navigate("/admin/lista-vendedores");
    }
    if (isError && message === "ERROR PERMISOS") {
      toast.error(
        "Error no tienes permisos necesarios para realizar esta acción"
      );
      return;
    }
    if (isError && !isExisting) {
      toast.error("Algo salió mal al agregar el Proveedor!");
    }
    if (isExisting) {
      toast.error("¡El Proveedor ya existe!");
      console.log(message);
    }
  }, [isSuccess, isError, isLoading, createdUser, updatedUser, isExisting]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      nombre: nombre || "",
      correo: correo || "",
      cedula: cedula || "",
      telefono: telefono || "",
      direccion: direccion || "",
      contrasenia: contrasenia || "",
      fecha_contratacion: fecha_contratacion || null,
      fecha_despido: fecha_despido || null,
      motivo: motivo || "",
      id_rol: id_rol || "",
    },
    validationSchema: schema,
    onSubmit: (values) => {
      if (getUserId !== undefined) {
        const data = { id: getUserId, userData: values };
        dispatch(updateAUser(data));
        //dispatch(resetState());
      } else {
        dispatch(createEmpleado(values));
        formik.resetForm();
        setTimeout(() => {
          dispatch(resetState());
        }, 3000);
      }
    },
  });

  const normalizeAndCapitalize = (inputValue) => {
    const normalizedValue = inputValue.replace(/\s+/g, " ");
    const trimmedValue = normalizedValue.replace(/^\s+/g, "");
    const capitalizedValue = capitalizeFirstLetter(trimmedValue);
    return capitalizedValue;
  };

  return (
    <div>
      <h3 className="mb-4  title">
        {getUserId !== undefined ? "Editar" : "Agregar"} Empleado
      </h3>

      <div>
        <form
          action=""
          onSubmit={formik.handleSubmit}
          style={{ width: "500px", padding: "30px" }}
        >
          <label style={labelStyles}>Rol del Empleado</label>
          <Select
            placeholder="Seleccione el rol"
            onChange={(value) => formik.setFieldValue("id_rol", value)}
            value={formik.values.id_rol}
            onBlur={formik.handleBlur("id_rol")}
          >
            <Option value="6669074f41dcdb08eee0128e">Cajera</Option>
            <Option value="6669075e41dcdb08eee01291">Mecanico</Option>
          </Select>
          <div className="error">
            {formik.touched.id_rol && formik.errors.id_rol}
          </div>

          <label style={labelStyles}>Nombre del Empleado</label>
          <CustomInput
            type="text"
            label="Nombre del Empleado"
            placeholder="Ingrese el nombre"
            onChng={(e) => {
              const formattedValue = normalizeAndCapitalize(e.target.value);
              formik.handleChange("nombre")({
                target: { value: formattedValue },
              });
            }}
            onBlr={formik.handleBlur("nombre")}
            val={formik.values.nombre}
            id="seller"
          />
          <div className="error">
            {formik.touched.nombre && formik.errors.nombre}
          </div>

          {/* Cierre Nombre */}

          <label style={labelStyles}>Cedula del Empleado</label>
          <CustomInput
            type="number"
            label="Cedula del Empleado"
            placeholder="Ingrese la cédula"
            onChng={(e) => {
              formik.handleChange("cedula")(e.target.value);
            }}
            onBlr={formik.handleBlur("cedula")}
            val={formik.values.cedula}
          />
          <div className="error">
            {formik.touched.cedula && formik.errors.cedula}
          </div>

          {/* Cierre Cedula */}

          <label style={labelStyles}>Correo del Proveedor</label>
          <CustomInput
            type="text"
            label="Correo electrónico"
            placeholder="Ingrese el correo"
            onChng={(e) => {
              formik.handleChange("correo")(e.target.value);
            }}
            onBlr={formik.handleBlur("correo")}
            val={formik.values.correo}
          />
          <div className="error">
            {formik.touched.correo && formik.errors.correo}
          </div>

          {/* Cierre Correo */}

          {getUserId === undefined && (
            <>
              <label style={labelStyles}>Contraseña del Empleado</label>
              <CustomInput
                type="text"
                label="Contraseña"
                placeholder="Ingrese una contraseña"
                onChng={(e) => {
                  formik.handleChange("contrasenia")(e.target.value);
                }}
                onBlr={formik.handleBlur("contrasenia")}
                val={formik.values.contrasenia}
                id="seller"
              />
              <div className="error">
                {formik.touched.contrasenia && formik.errors.contrasenia}
              </div>
            </>
          )}

          {/* Cierre Contraseña */}

          <label style={labelStyles}>Número Telefonico del Proveedor</label>
          <CustomInput
            type="number"
            label="Número Telefonico del Proveedor"
            placeholder="Ingrese el Telefono"
            onChng={(e) => {
              formik.handleChange("telefono")(e.target.value);
            }}
            onBlr={formik.handleBlur("telefono")}
            val={formik.values.telefono}
          />
          <div className="error">
            {formik.touched.telefono && formik.errors.telefono}
          </div>

          {/* Cierre Número Telefonico */}

          <label style={labelStyles}>Fecha de Contratación</label>
          <DatePicker
            style={{ width: "100%" }}
            placeholder="Seleccione la fecha de contratación"
            value={
              formik.values.fecha_contratacion
                ? dayjs(formik.values.fecha_contratacion)
                : null
            }
            onChange={(date, dateString) =>
              formik.setFieldValue("fecha_contratacion", dateString)
            }
            onBlur={formik.handleBlur("fecha_contratacion")}
            locale={{
              lang: {
                locale: "es",
              },
            }}
          />
          <div className="error">
            {formik.touched.fecha_contratacion &&
              formik.errors.fecha_contratacion}
          </div>

          {/* Cierre fecha contratacion */}

          <label style={labelStyles}>Fecha de Despido</label>
          <DatePicker
            style={{ width: "100%" }}
            placeholder="Seleccione la fecha de despido"
            value={
              formik.values.fecha_despido
                ? dayjs(formik.values.fecha_despido)
                : null
            }
            onChange={(date, dateString) =>
              formik.setFieldValue("fecha_despido", dateString)
            }
            onBlur={formik.handleBlur("fecha_despido")}
            locale={{
              lang: {
                locale: "es",
              },
            }}
          />
          <div className="error">
            {formik.touched.fecha_despido && formik.errors.fecha_despido}
          </div>

          {/* Cierre fecha despido */}

          <label style={labelStyles}>Motivo Despido</label>
          <CustomInput
            type="text"
            label="Motivo Despido"
            placeholder="Ingrese el Motivo"
            onChng={(e) => {
              formik.handleChange("motivo")(e.target.value);
            }}
            onBlr={formik.handleBlur("motivo")}
            val={formik.values.motivo}
          />
          <div className="error">
            {formik.touched.motivo && formik.errors.motivo}
          </div>

          <button
            className="btn btn-success border-0 rounded-3 my-5"
            type="submit"
          >
            {getUserId !== undefined ? "Editar" : "Agregar"} Proveedor
          </button>

          {getUserId !== undefined && (
            <button
              style={{ marginLeft: "15px" }}
              className="btn btn-secondary border-0 rounded-3 my-5"
              type="button"
              onClick={goBack}
            >
              Cancelar
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default AgregarEmpleado;
