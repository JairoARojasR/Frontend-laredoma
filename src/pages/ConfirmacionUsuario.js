import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getAConfirmUser, resetState } from "../features/usuario/usuarioSlice";

const ConfirmacionUsuario = () => {
  const dispatch = useDispatch();
  const { token } = useParams();
  const { isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.user
  );

  useEffect(() => {
    dispatch(getAConfirmUser(token));
    return () => {
      dispatch(resetState());
    };
  }, [dispatch, token]);

  return (
    <div
      className="confirmation-container"
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "#ffffff",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {isLoading && (
        <p className="loading-text"style={{
            color: "#ffffff",
            fontSize: "50px",
            backgroundColor: "#0A2EC2",
            padding: "30px",
            borderRadius: "20px",
          }}>
          Cargando... ⌛
        </p>
      )}
      {isError && (
        <p
          className="error-text"
          style={{
            color: "#ffffff",
            fontSize: "50px",
            backgroundColor: "#7D000D",
            padding: "30px",
            borderRadius: "20px",
          }}
        >
          Error: {message && message.message} 😞
        </p>
      )}
      {isSuccess && (
        <p
          className="success-text"
          style={{
            color: "#ffffff",
            fontSize: "50px",
            backgroundColor: "#02A502",
            padding: "30px",
            borderRadius: "20px",
          }}
        >
          ¡Cuenta confirmada exitosamente! 🎉
        </p>
      )}
    </div>
  );
};

export default ConfirmacionUsuario;
