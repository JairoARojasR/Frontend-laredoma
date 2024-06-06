import { React, useEffect } from "react";
import CustomInput from "../components/CustomInput";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as yup from "yup";
import { useFormik } from "formik";
import { Select } from "antd";
import {
  createCategory,
  getAProductCategory,
  resetState,
  updateAProductCategory,
} from "../features/categoria/categoriaSlice";
const { Option } = Select;
let schema = yup.object().shape({
  nombre: yup.string().required("Nombre de Categoria es requerido")
  .matches(/^[A-Za-záéíóúüñÁÉÍÓÚÜÑ\s]+$/, "El nombre solo puede contener letras"),
  genero: yup.string().required("Género es requerido"),
});

const capitalizeFirstLetter = (word) => {
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
};

const normalizeAndCapitalize = (inputValue) => {
  const normalizedValue = inputValue.replace(/\s+/g, " ");
  const trimmedValue = normalizedValue.replace(/^\s+/g, "");
  const capitalizedValue = capitalizeFirstLetter(trimmedValue);
  return capitalizedValue;
};

const Addcat = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const getPCatId = location.pathname.split("/")[3];
  const navigate = useNavigate();
  const newCategory = useSelector((state) => state.category);
  const {
    isSuccess,
    isError,
    isLoading,
    message,
    isExisting,
    createdCategory,
    categoryName,
    generoName,
    updatedCategory,
  } = newCategory;

  useEffect(() => {
    if (getPCatId !== undefined) {
      dispatch(getAProductCategory(getPCatId));
    } else {
      dispatch(resetState());
    }
  }, [getPCatId]);
  useEffect(() => {
    if (isSuccess && createdCategory && !isExisting) {
      toast.success("Categoría agregada exitosamente!");
    }
    if (isSuccess && updatedCategory) {
      toast.success("¡Categoría actualizada exitosamente!");
      navigate("/admin/lista-categorias");
    }
    if (isError && !isExisting) {
      toast.error("¡Estas intentando editar con los mismos datos de una categoria existente!");    }
    if (isExisting) {
      toast.error("¡La categoría ya existe!");
    }
  }, [
    isSuccess,
    isError,
    isLoading,
    createdCategory,
    updatedCategory,
    isExisting,
  ]);
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      nombre: categoryName || "",
      genero: generoName || "",
    },
    validationSchema: schema,
    onSubmit: (values) => {
      if (getPCatId !== undefined) {
        const data = { id: getPCatId, pCatData: values };
       dispatch(updateAProductCategory(data));
       dispatch(resetState());
      } else {
        dispatch(createCategory(values));
        formik.resetForm();
        setTimeout(() => {
          dispatch(resetState());
        }, 3000);
      }
    },
  });
  return (
    <div>
      <h3 className="mb-4  title">
        {getPCatId !== undefined ? "Editar" : "Agregar"} Categoria
      </h3>
      <div>
        <form action="" onSubmit={formik.handleSubmit}>
          <CustomInput
            type="text"
            label="Ingrese el nombre de la categoría."
            onChng={(e) => {
              const formattedValue = normalizeAndCapitalize(e.target.value);
              formik.handleChange("nombre")({
                target: { value: formattedValue },
              });
            }}
            onBlr={formik.handleBlur("nombre")}
            val={formik.values.nombre}
            id="category"
          />
          <div className="error">
            {formik.touched.nombre && formik.errors.nombre}
          </div>

          <Select style={{marginTop: '20px'}}
           label="Ingrese el genero de la categoria."
            placeholder="Seleccione el género"
            onChange={(value) => formik.setFieldValue("genero", value)}
            onBlur={formik.handleBlur("genero")}
            value={formik.values.genero}
          >
            <Option value="" disabled hidden>
              Selecciona el género
            </Option>
            <Option value="hombre">Hombre</Option>
            <Option value="mujer">Mujer</Option>
          </Select>
          <div className="error">
            {formik.touched.genero && formik.errors.genero}
          </div>
          <button
            className="btn btn-success border-0 rounded-3 my-5"
            type="submit"
          >
            {getPCatId !== undefined ? "Editar" : "Agregar"} Categoria
          </button>
          {console.log(formik.values)}
        </form>
      </div>
    </div>
  );
};

export default Addcat;
