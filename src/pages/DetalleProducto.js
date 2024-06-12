import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";
import { resetState, getAProduct } from "../features/producto/productoSlice";
import { getCategorias } from "../features/categoria/categoriaSlice";
import { Button, Space } from "antd";
import Gallery from "react-image-gallery";
import "../components/image-gallery.css";
import "../styles/Product.css";
import { Carousel } from "antd";

const DetalleProducto = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const getProdId = location.pathname.split("/")[3];
  const productState = useSelector((state) => state.producto);
  const catState = useSelector((state) => state.categoria.categorias);

  const {
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
  } = productState;

  useEffect(() => {
    if (getProdId !== undefined) {
      dispatch(getAProduct(getProdId));
    } else {
      dispatch(resetState());
    }
  }, [getProdId, dispatch]);

  useEffect(() => {
    dispatch(getCategorias());
    //dispatch(getColors());
  }, [dispatch]);

  const goBack = () => {
    navigate(-1);
  };

  const getCategoryName = (categoryId) => {
    const category = catState.find((cat) => cat._id === categoryId);
    return category ? category.nombre : "Categoría desconocida";
  };

  return (
    <div className="product-details-container">
      <div className="header">
        <h3>Detalles del Producto</h3>
        <button class="learn-more" onClick={goBack}>
          <span class="circle" aria-hidden="true">
            <span class="icon">
              <i class="fas fa-chevron-left"></i>
            </span>
          </span>
          <span class="button-text">Volver</span>
        </button>
      </div>

      <div className="product-info">
        <div className="variations">
          <div className="product-images">
            {/* Integrar el Carousel aquí */}
            <Carousel arrows dotPosition="bottom" infinite={false}>
              {Array.isArray(productImg) &&
                productImg.length > 0 &&
                productImg.map((image, index) => (
                  <div key={index} className="product-image">
                    <img
                      src={image.url}
                      alt={`Imagen ${index + 1}`}
                      className="image-thumbnail"
                      style={{ width: "380px", maxHeight: "300px"  , display: 'block',
                        margin: '70px auto', }} // Establecer el tamaño predeterminado
                    />
                  </div>
                ))}
            </Carousel>
          </div>
        </div>

        <div className="details-section">
          <div className="product-details">
            <h6>Nombre:</h6>
            <p>{productName}</p>

            <h6>Referencia:</h6>
            <p>{productReference}</p>

            <h6>Descripción:</h6>
            <div dangerouslySetInnerHTML={{ __html: productDescription }} />

            <h6>Ubicación Almacen:</h6>
            <p>{productUbicacion}</p>

            <h6>Cantidad:</h6>
            <p>{productCant}</p>

            <h6>Categoría:</h6>
            <p>{getCategoryName(productCategory)}</p>

            <h6>Precio:</h6>
            <p>{productPrice}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetalleProducto;
