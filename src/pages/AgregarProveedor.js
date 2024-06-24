import { React, useEffect } from "react";
import CustomInput from "../components/CustomInput";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
//import withBodyClass from "../components/wrapper";
import "../styles/Botones.css"
//import "../styles/Body.pages.css"
import * as yup from "yup";
import { useFormik } from "formik";
import {
  createProveedor,
  getAUser,
  resetState,
  updateAUser,
} from "../features/usuario/usuarioSlice";

let schema = yup.object().shape({
  nombre: yup.string()
    .required("El nombre del vendedor es obligatorio")
    .matches(/^[A-Za-záéíóúüñÁÉÍÓÚÜÑ\s]+$/, "El nombre solo puede contener letras"),
  cedula: yup.string()
    .required("La cedula del vendedor es obligatoria")
    .matches(/^\d{7,10}$/, "La cedula debe tener entre 7 y 10 dígitos"),
  correo: yup.string().email("El correo debe ser un email válido").required("El correo del vendedor es obligatorio"),

});

const capitalizeFirstLetter = (word) => {
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
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


const AgregarProveedor = () => {
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
    telefono,
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
      navigate("/admin/lista-proveedores");
    }
    if (isError && message === "ERROR PERMISOS") {
      toast.error("Error no tienes permisos necesarios para realizar esta acción");
      return;
    }
    if (isError && !isExisting) {
      toast.error("Verifica Por favor el número de cédula ya existe en otro Proveedor");
    }
    if (isExisting) {
      toast.error("¡El Proveedor ya existe, Por favor verifica la cédula!");
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
    },
    validationSchema: schema,
    onSubmit: (values) => {
      if (getUserId !== undefined) {
        const data = { id: getUserId, userData: values };
       dispatch(updateAUser(data));
       //dispatch(resetState());
      } else {
        dispatch(createProveedor(values));
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
        {getUserId !== undefined ? "Editar" : "Agregar"} Proveedor
      </h3>

      <div>
        <form action="" onSubmit={formik.handleSubmit} style={{ width: "500px", padding: "30px" }}>
          <label style={labelStyles}>Nombre del Proveedor</label>
          <CustomInput
            type="text"
            label="Nombre del Proveedor"
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
          <label style={labelStyles}>Cedula del Proveedor</label>
          <CustomInput
            type="number"
            label="Cedula del Proveedor"
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

          <label style={labelStyles}>Dirección del Proveedor</label>
          <CustomInput
            type="text"
            label="Dirección del Proveedor"
            placeholder="Ingrese la direccion"
            onChng={(e) => {
              const formattedValue = normalizeAndCapitalize(e.target.value);
              formik.handleChange("direccion")({
                target: { value: formattedValue },
              });
            }}
            onBlr={formik.handleBlur("direccion")}
            val={formik.values.direccion}
            id="seller"
          />
          <div className="error">
            {formik.touched.direccion && formik.errors.direccion}
          </div>
            
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

          <button
            type="submit"
          >
            {getUserId !== undefined ? "Editar" : "Agregar"} Proveedor
          </button>

          {getUserId !== undefined && (
            <button style={{marginLeft:'15px'}}
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

export default AgregarProveedor;
