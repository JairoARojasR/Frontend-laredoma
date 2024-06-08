import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import "../styles/resent.css";
import {
  updateAUser,
  resetPassword
} from "../features/usuario/usuarioSlice";
export default function Reset() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const correo = localStorage.getItem("email");

  function handleChangePassword() {
    // Validar que las contraseñas coincidan
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    // Validar que la nueva contraseña tenga al menos 8 caracteres
    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }


    try {
      const nuevaContrasenia=password;
      const passwordData = {
        correo,
        nuevaContrasenia,
      };
      dispatch(resetPassword(passwordData));
      navigate("/contrasenia-recuperada");
    } catch (error) {
      setError("Hubo un error al cambiar la contraseña.");
    }
  }

  return (
    <div className="containerColor">
      <div className="cont">
        <div>
          <div className="card">
            <h2>
              Cambiar Contraseña
              </h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <div className="form-prueba">
            <form>
              
              <div className="contra">
                <label 
                  htmlFor="password"
                          >
                  Nueva Contraseña
                </label>
                
                <input 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="confirm-password"
                >
                  Confirmar contraseña
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <div className="contenedor-boton">
              <button className="boton"
                onClick={handleChangePassword}
              >
                Cambiar Contraseña
              </button>
              </div>
            </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
