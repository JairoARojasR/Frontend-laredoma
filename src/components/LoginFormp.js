import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button, Input, Space } from "antd";
import dayjs from "dayjs";
import styles from "../styles/LoginFormp.module.css";
import logo from "../images/Logo3.png";
import {
  createUser,
  loginUser,
  resetState,
} from "../features/usuario/usuarioSlice";
import userService from "../features/usuario/usuarioService";
import { base_url } from "../utils/baseUrl";
import { toast } from "react-toastify";
import GoogleLogin from "react-google-login";
import { gapi } from "gapi-script";
import * as yup from "yup";
import { RecoveryContext } from "../App";

const schema2 = yup.object().shape({
  correo: yup
    .string()
    .required("El correo es requerido")
    .email("Ingrese un correo electrónico válido"),
  contrasenia: yup.string().required("La contraseña es requerida"),
});

function LoginFormp() {
  const dispatch = useDispatch();
  const { setEmail, setPage, setOTP } = useContext(RecoveryContext);
  const [googleLoggedIn, setGoogleLoggedIn] = useState(false);
  const navigate = useNavigate();
  const clientID = "967586754412-4jsvq7hnqkb5pfl30dbcpt93ghjfgn94.apps.googleusercontent.com";

  const [loginData, setLoginData] = useState({
    correo: "",
    contrasenia: "",
  });

  const [errors2, setErrors2] = useState({
    correo: "",
    contrasenia: "",
  });

  const newUser = useSelector((state) => state.user);
  const {
    isSuccess,
    isError,
    users,
    isExisting,
  } = newUser;

  useEffect(() => {
    function start() {
      gapi.client.init({
        clientId: clientID,
      });
    }
    gapi.load("client:auth2", start);
  }, [clientID]);

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    try {
      schema2.validateSyncAt(name, { [name]: value });
      setErrors2((prevErrors) => ({ ...prevErrors, [name]: "" }));
    } catch (error) {
      setErrors2((prevErrors) => ({ ...prevErrors, [name]: error.message }));
    }
  };

  const handleLoginUp = async (e) => {
    e.preventDefault();
    try {
      await schema2.validate(loginData, { abortEarly: false });
      const resultAction = await dispatch(loginUser(loginData));
      if (loginUser.fulfilled.match(resultAction)) {
        navigate("/admin");  
      }
      setLoginData({
        correo: "",
        contrasenia: "",
      });
    } catch (error) {
      const validationErrors = {};
      if (error.inner) {
        error.inner.forEach((e) => {
          validationErrors[e.path] = e.message;
        });
      }
      setErrors2(validationErrors);

      if (error.message === "Por favor completa todos los campos.") {
        toast.error("Por favor completa todos los campos.");
      } else {
        toast.error("Algo salió mal al iniciar sesión");
      }
    }
  };

  const onGoogleSuccess = async (response) => {
    try {
      const userData = {
        nombre: response.profileObj.name,
        correo: response.profileObj.email,
        estado: "Verificado",
      };

      const userListAction = await userService.getUsers();
      if (userListAction) {
        const existingUser = userListAction.find(
          (user) => user.correo === userData.correo
        );

        if (existingUser) {
          dispatch(loginUser(userData));
          navigate("/admin");
          const updatedUser = await userService.getUser(userData.correo);
          if (updatedUser) {
            dispatch(loginUser(updatedUser));
            window.location.reload();
          }
        }
      } else {
        console.error("Error al obtener la lista de usuarios");
      }
    } catch (error) {
      console.error("Error al comunicarse con Google:", error);
    }
  };

  const onGoogleFailure = (response) => {
    console.log("Algo salió mal al iniciar sesión con Google");
  };

  function navigateToOtp() {
    if (loginData.correo) {
      const OTP = Math.floor(Math.random() * 9000 + 1000);
      setOTP(OTP);
      setEmail(loginData.correo);
      localStorage.setItem("otp", OTP);
      localStorage.setItem("email", loginData.correo);
      axios.post(`${base_url}usuario/send_recovery_email`, {
        OTP,
        recipient_email: loginData.correo,
      });
    } else {
      alert("Por favor, ingrese su correo electrónico en el inicio de sesión para recuperar su cuenta");
      return;
    }
    navigate("/confirmar-codigo");
    return;
  }

  return (
    <div className={styles.body_login}>
      <div className={styles.container} id="container">
        <div className={`${styles.form_container} ${styles.sign_in_container}`}>
          <form action="#" className={styles.form_login}>
            <h1 className={styles.encabezado}>INICIAR SESIÓN</h1>
            <span>Ingresa con:</span>
            {!googleLoggedIn && (
              <div className={styles.social_container}>
                <GoogleLogin
                  clientId={clientID}
                  buttonText="Iniciar Sesión"
                  onSuccess={onGoogleSuccess}
                  onFailure={onGoogleFailure}
                  cookiePolicy="none"
                />
              </div>
            )}
            <span>O usa tu cuenta</span>
            <input
              type="email"
              placeholder="Ingrese Correo"
              name="correo"
              value={loginData.correo}
              onChange={handleLoginChange}
            />
            <div className={styles.error_message}>{errors2.correo}</div>
            <input
              type="password"
              placeholder="Ingrese Contraseña"
              name="contrasenia"
              value={loginData.contrasenia}
              onChange={handleLoginChange}
            />
            <div className={styles.error_message}>{errors2.contrasenia}</div>
            <a href="" onClick={() => navigateToOtp()}>¿Olvidó la contraseña?</a>
            <button className={styles.button_green} onClick={handleLoginUp}>
              Iniciar Sesión
            </button>
          </form>
        </div>
        <div className={styles.overlay_container}>
          <div className={styles.overlay}>
            <div className={`${styles.overlay_panel} ${styles.overlay_left}`}>
              <img src={logo} className={styles.logomadais} alt="" />
              <h1 className={styles.h1_alt}>¡Bienvenido de vuelta!</h1>
              <p>
                Inicia Sesión en tu cuenta personal para acceder a ofertas
                exclusivas, seguir tus pedidos y vivir la experiencia completa
                de Madais Sports.
              </p>
              <button
                className={styles.button_blue}
                onClick={() => {}}
              >
                Iniciar Sesión
              </button>
            </div>
            <div className={`${styles.overlay_panel} ${styles.overlay_right}`}>
              <img src={logo} className={styles.logomadais} alt="" />
              <h1 className={styles.h1_alt}>
                ¡Únete a la comunidad Madais Sports!
              </h1>
              <p>
                Regístrate para acceder a nuestros artículos y recibir ofertas
                exclusivas.
              </p>
              <p>¡Tu viaje hacia el rendimiento y el estilo comienza aquí!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginFormp;
