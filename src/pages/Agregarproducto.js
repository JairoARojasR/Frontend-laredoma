import React, { useState, useEffect, useCallback } from "react";
import CustomInput from "../components/CustomInput";
import ReactQuill from "react-quill";
import Dropzone from "react-dropzone";
import { useDropzone } from "react-dropzone";
import { useDispatch, useSelector } from "react-redux";
import "react-quill/dist/quill.snow.css";
import { Select, Space, Input, Switch, Spin } from "antd"; //aqui
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import { Button, Popover } from "antd";
import * as yup from "yup";
import { useFormik } from "formik";
import { useNavigate, useLocation } from "react-router-dom";
import { getMarcasauto } from "../features/marca_auto/marcaautoSlice";
import { getUsers } from "../features/usuario/usuarioSlice";
import { getCategorias } from "../features/categoria/categoriaSlice";
import { delImg, uploadImg } from "../features/upload/uploadSlice";
import productService from "../features/producto/productoService";
import { IoCloseOutline } from "react-icons/io5";
import "../styles/Addproducts.css";

import {
  createProducts,
  resetState,
  updateAProduct,
  getAProduct,
} from "../features/producto/productoSlice";
const { Option } = Select;

const schema = yup.object().shape({
  nombre: yup.string().required("El nombre es requerido"),
  ubicacion: yup.string().required("La ubicación es requerida"),
  referencia: yup
    .string()
    .required("La referencia es requerida")
    .matches(/^\d{3,8}$/, "La referencia debe tener entre 3 y 8 dígitos"),
  descripcion: yup.string().required("Una descripción es requerida"),
  precio: yup
    .number()
    .required("El precio es requerido")
    .positive("El precio debe ser mayor a 10.000"),
  cantidad_disponible: yup
    .number()
    .min(1, "La cantidad minima es de 1")
    .required("Las cantidades disponibles son requeridas"),
  categoria: yup.string().required("Categoría es requerido"),
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

const Agregarproducto = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const getProdId = location.pathname.split("/")[3];
  const [isUploading, setIsUploading] = useState(false);
  const [imagenes, setImagenes] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [showDiscountFields, setShowDiscountFields] = useState(false);

  const [open0, setOpen0] = useState(false);
  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);
  const [open4, setOpen4] = useState(false);

  const hide1 = () => {
    setOpen1(false);
  };

  const hide0 = () => {
    setOpen0(false);
  };

  const hide2 = () => {
    setOpen2(false);
  };

  const hide3 = () => {
    setOpen3(false);
  };

  const hide4 = () => {
    setOpen4(false);
  };
  const handleOpenChange0 = (newOpen) => {
    setOpen0(newOpen);
  };

  const handleOpenChange1 = (newOpen) => {
    setOpen1(newOpen);
  };

  const handleOpenChange2 = (newOpen) => {
    setOpen2(newOpen);
  };

  const handleOpenChange3 = (newOpen) => {
    setOpen3(newOpen);
  };

  const handleOpenChange4 = (newOpen) => {
    setOpen4(newOpen);
  };

  const userState = useSelector((state) => state.user.users);
  const marcaState = useSelector((state) => state.marcaauto.marcas);
  const catState = useSelector((state) => state.categoria.categorias);
  const imgState = useSelector((state) => state.upload.images);

  
  useEffect(() => {
    dispatch(getMarcasauto());
    dispatch(getCategorias());
   dispatch(getUsers());
  }, [dispatch]);


  const newProduct = useSelector((state) => state.producto);
  const {
    isSuccess,
    isError,
    isLoading,
    isExisting,
    createdProduct,
    updatedProduct,
    productName,
    productDescription,
    productUbicacion,
    productCant,
    productPrice,
    productProv,
    productImg,
    productCategory,
    productMarca,
    productReference,
    productVariations,
  } = newProduct;

  useEffect(() => {
    if (getProdId !== undefined) {
      dispatch(getAProduct(getProdId));
    } else {
      dispatch(resetState());
    }
  }, [getProdId]);
  

  useEffect(() => {
    if (productImg && productImg.length > 0) {
      setImagenes(productImg);
    }
  }, [productImg]);

  useEffect(() => {
    if (isSuccess && createdProduct && !isExisting) {
      toast.success("Producto agregado exitosamente!");
      formik.resetForm();
      setShowDiscountFields(false);
    }
    if (isSuccess && updatedProduct) {
      toast.success("Producto actualizado existosamente!");
      navigate("/admin/lista-productos");
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

  const img = [];
  imgState.forEach((i) => {
    img.push({
      public_id: i.public_id,
      url: i.url,
    });
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      nombre: productName || "",
      descripcion: productDescription || "",
      cantidad_disponible: productCant || "",
      ubicacion: productUbicacion || "",
      precio: productPrice || "",
      categoria: productCategory || "",
      referencia: productReference || "",
      marca_auto: productMarca || [],
      imagenes: productImg || [],
      proveedores: productProv || [],
    },
    validationSchema: schema,
    onSubmit: (values) => {
      if (getProdId !== undefined) {
        const data = { id: getProdId, productData: values };
        dispatch(updateAProduct(data));
        dispatch(resetState());
      } else {
        dispatch(createProducts(values));
        setTimeout(() => {
          dispatch(resetState());
          dispatch(getUsers());
          dispatch(getCategorias());
          dispatch(getMarcasauto());
        }, 3000);
      }
    },
  });

 const handleImageChange = async (files) => {
    setIsUploading(true);
  
    try {
      const newImages = [];
      const uploadedImage = await dispatch(uploadImg(files));
  
      if (Array.isArray(uploadedImage.payload)) {
        uploadedImage.payload.forEach((image) => {
          const imageInfo = {
            public_id: image.public_id,
            url: image.url,
          };
          newImages.push(imageInfo);
        });
  
        // Agregar las nuevas imágenes al estado existente
        setImagenes((prevImages) => {
          const updatedImages = [...prevImages, ...newImages];
          formik.setFieldValue("imagenes", updatedImages);
          return updatedImages;
        });
      } else {
        console.error("Uploaded image is not an array:", uploadedImage);
      }
    } catch (error) {
      console.error("Error during image upload:", error);
    } finally {
      setIsUploading(false);
    }
  };
  

  const handleRemoveImage = async (imageIndex) => {
    setImagenes((prevImages) => {
      const updatedImages = prevImages.filter((_, i) => i !== imageIndex);

      // Llamar a la acción para eliminar la imagen de Cloudinary
      dispatch(delImg(prevImages[imageIndex].public_id))
        .then((result) => {
          console.log("La imagen ha sido eliminada ", result);
        })
        .catch((error) => {
          console.error("Hubo un error al eliminar la imagen", error);
        });

      formik.setFieldValue("imagenes", updatedImages);
      return updatedImages;
    });
  };

  return (
    <div className="formulario_productos">
      <h3 className="mb-4  title">
        {getProdId !== undefined ? "Editar" : "Agregar"} Producto
        {console.log("formik", formik.values)}
      </h3>

      <div>
        <form
          onSubmit={formik.handleSubmit}
          className="d-flex gap-3 flex-column"
        >
          <section className="form_section">
            <div className="form_data">
              {/* NOMBRE */}

              <label>Nombre del Producto</label>
              <Popover
                content={<a onClick={hide1}>Cerrar</a>}
                title="Por favor, elige un nombre que no siendo utilizado en otro producto"
                trigger="click"
                open={open1}
                onOpenChange={handleOpenChange1}
              >
                <Button type="primary" style={{ borderRadius: "50%" }}>
                  ?
                </Button>
              </Popover>
              <CustomInput
                type="text"
                label="Ingrese el nombre del producto"
                onChng={(e) => {
                  const formattedValue = normalizeAndCapitalize(e.target.value);
                  formik.handleChange("nombre")({
                    target: { value: formattedValue },
                  });
                }}
                onBlr={formik.handleBlur("nombre")}
                val={formik.values.nombre}
              />
              <div className="error">
                {formik.touched.nombre && formik.errors.nombre}
              </div>

              {/* NOMBRE */}

              {/* UBICACION */}
              <label>Ubicación en el Producto</label>
              <Popover
                content={<a onClick={hide0}>Cerrar</a>}
                title="Por favor, verifica el código de estante antes de ingresarlo"
                trigger="click"
                open={open0}
                onOpenChange={handleOpenChange0}
              >
                <Button type="primary" style={{ borderRadius: "50%" }}>
                  ?
                </Button>
              </Popover>
              <CustomInput
                type="text"
                label="Ingrese el código del estante"
                onChng={(e) => {
                  const formattedValue = normalizeAndCapitalize(e.target.value);
                  formik.handleChange("ubicacion")({
                    target: { value: formattedValue },
                  });
                }}
                onBlr={formik.handleBlur("ubicacion")}
                val={formik.values.ubicacion}
              />
              <div className="error">
                {formik.touched.ubicacion && formik.errors.ubicacion}
              </div>
              {/* UBICACION */}

              {/* REFERENCIA */}
              <label>Referencia del Producto</label>
              <Popover
                content={<a onClick={hide2}>Cerrar</a>}
                title="Por favor, elige una referencia que no siendo utilizada en otro producto"
                trigger="click"
                open={open2}
                onOpenChange={handleOpenChange2}
              >
                <Button type="primary" style={{ borderRadius: "50%" }}>
                  ?
                </Button>
              </Popover>
              <CustomInput
                type="number"
                label="Ingrese la referencia del producto"
                onChng={(e) => {
                  formik.handleChange("referencia")(e);
                }}
                onBlr={formik.handleBlur("referencia")}
                val={formik.values.referencia}
              />
              <div className="error">
                {formik.touched.referencia && formik.errors.referencia}
              </div>
              {/* REFERENCIA */}

              {/* CANTIDAD DISPONIBLE */}
              <label>Cantidad Disponible del producto</label>
              <CustomInput
                type="number"
                label="Ingrese la cantidad disponible del producto"
                name="price"
                onChng={formik.handleChange("cantidad_disponible")}
                onBlr={formik.handleBlur("cantidad_disponible")}
                val={formik.values.cantidad_disponible}
              />
              <div className="error">
                {formik.touched.cantidad_disponible &&
                  formik.errors.cantidad_disponible}
              </div>
              {/* CANTIDAD DISPONIBLE */}

              {/* PRECIO DEL PRODUCTO */}
              <label>Precio del producto</label>
              <CustomInput
                type="number"
                label="Ingrese el precio del producto"
                name="price"
                onChng={formik.handleChange("precio")}
                onBlr={formik.handleBlur("precio")}
                val={formik.values.precio}
              />
              <div className="error">
                {formik.touched.precio && formik.errors.precio}
              </div>
              {/* PRECIO DEL PRODUCTO */}

              {/* CATEGORIA */}
              <label>Categoria del producto</label>
              <Popover
                content={<a onClick={hide3}>Cerrar</a>}
                title="Por favor seleccione una de las siguientes categorias registradas"
                trigger="click"
                open={open3}
                onOpenChange={handleOpenChange3}
              >
                <Button type="primary" style={{ borderRadius: "50%" }}>
                  ?
                </Button>
              </Popover>

              <Select
                showSearch
                value={formik.values.categoria}
                onChange={(value) => {
                  formik.setFieldValue("categoria", value);
                }}
                onBlur={formik.handleBlur("categoria")}
                style={{ width: "100%" }}
                optionFilterProp="value"
                filterOption={(input, option) =>
                  option.value.toLowerCase().indexOf(input.toLowerCase()) >=
                    0 ||
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                    0
                }
              >
                <Option value="">Seleccione una categoría</Option>
                {catState.map((i, j) => (
                  <Option key={j} value={i._id} disabled={!i.activo}>
                    {i.nombre}
                  </Option>
                ))}
              </Select>
              <div className="error">
                {formik.touched.categoria && formik.errors.categoria}
              </div>
              {/* CATEGORIA */}

              {/* PROVEEDORES */}
              <label>Proveedores</label>
              <Popover
                content={<a onClick={hide3}>Cerrar</a>}
                title="Por favor seleccione los proveedores del producto"
                trigger="click"
                open={open3}
                onOpenChange={handleOpenChange3}
              >
                <Button type="primary" style={{ borderRadius: "50%" }}>
                  ?
                </Button>
              </Popover>

              <Select
                mode="multiple"
                placeholder="Seleccione un proveedor"
                showSearch
                value={formik.values.proveedores}
                onChange={(value) => {
                  formik.setFieldValue("proveedores", value);
                }}
                onBlur={formik.handleBlur("proveedores")}
                style={{ width: "100%" }}
                optionFilterProp="value"
                filterOption={(input, option) =>
                  option.value.toLowerCase().indexOf(input.toLowerCase()) >=
                    0 ||
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                    0
                }
              >
                {userState.map((user) => {
                  if (user.id_rol === "6667c97dbb2265c8a8eba941") {
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
              <div className="error">
                {formik.touched.proveedores && formik.errors.proveedores}
              </div>
              {/* PROVEEDORES */}

              {/* MARCA AUTO */}
              <label>Marca de auto del producto</label>
              <Popover
                content={<a onClick={hide4}>Cerrar</a>}
                title="Por favor seleccione una de las siguiente marca de autos especialmente si el producto a agregar es un repuesto o exclusivo de una marca"
                trigger="click"
                open={open4}
                onOpenChange={handleOpenChange4}
              >
                <Button type="primary" style={{ borderRadius: "50%" }}>
                  ?
                </Button>
              </Popover>

              <Select
                mode="multiple"
                placeholder="Seleccione una marca de auto"
                showSearch
                value={formik.values.marca_auto}
                onChange={(value) => {
                  formik.setFieldValue("marca_auto", value);
                }}
                onBlur={formik.handleBlur("marca_auto")}
                style={{ width: "100%" }}
                optionFilterProp="value"
                filterOption={(input, option) =>
                  option.value.toLowerCase().indexOf(input.toLowerCase()) >=
                    0 ||
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                    0
                }
              >
                {marcaState.map((i, j) => (
                  <Option key={j} value={i._id} disabled={!i.activo}>
                    {i.nombre}
                  </Option>
                ))}
              </Select>

              <div className="error">
                {formik.touched.marca_auto && formik.errors.marca_auto}
              </div>
              {/* MARCA AUTO */}
            </div>
            <div className="form_description">
              {/* DESCRIPCION */}
              <label>Descripción del producto</label>
              <div>
                <ReactQuill
                  theme="snow"
                  name="description"
                  onChange={formik.handleChange("descripcion")}
                  value={formik.values.descripcion}
                  placeholder="Escribe la descripción del producto aquí"
                />
              </div>
              <div className="error">
                {formik.touched.descripcion && formik.errors.descripcion}
              </div>
              {/* DESCRIPCION */}
            </div>
          </section>

          <div
            className="showimages d-flex flex-wrap mt-3 mb-2 gap-3"
            style={{ alignItems: "center" }}
          >
            {imagenes?.map((image, imageIndex) => (
              <div
                className="position-relative image-container"
                key={imageIndex}
                onMouseEnter={() => setHoveredIndex(imageIndex)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {hoveredIndex === imageIndex && (
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(imageIndex)}
                    className="btn_delete position-absolute"
                  >
                    <IoCloseOutline />
                  </button>
                )}
                <img
                  src={image.url}
                  alt={`Imagen ${imageIndex + 1}`}
                  width={200}
                  height={200}
                />
              </div>
            ))}
            <div>
              <Dropzone
                onDrop={(acceptedFiles) => {
                  setIsUploading(true);
                  handleImageChange(acceptedFiles).finally(() =>
                    setIsUploading(false)
                  );
                }}
              >
                {({ getRootProps, getInputProps }) => (
                  <section>
                    <div
                      className="dropzone"
                      {...getRootProps()}
                      style={{
                        marginBottom: "10px",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <input {...getInputProps()} />
                      {isUploading ? (
                        <div style={{ position: "relative" }}>
                          <Spin tip="Cargando..." size="large">
                            <div
                              style={{ height: "50px", width: "55px" }}
                            ></div>
                          </Spin>
                        </div>
                      ) : (
                        <p>Agregar +</p>
                      )}
                    </div>
                  </section>
                )}
              </Dropzone>
            </div>
          </div>
          <button
            className="btn btn-success border-0 rounded-3 my-5"
            type="submit"
          >
            {getProdId !== undefined ? "Editar" : "Agregar"} Producto
          </button>
        </form>
      </div>
    </div>
  );
};

export default Agregarproducto;
