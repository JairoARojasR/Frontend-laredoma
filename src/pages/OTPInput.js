
import React from "react";
import { useState } from "react";
import { useContext } from "react";
import { RecoveryContext } from "../App";
import axios from 'axios';
import "../styles/OTP.css";
import { useNavigate } from "react-router-dom";
import { base_url } from "../utils/baseUrl";


export default function () {
 // const { setEmail, otp, setPage } = useContext(RecoveryContext);
  const [timerCount, setTimer] = React.useState(10);
  const navigate = useNavigate();
  const [OTPinput, setOTPinput] = useState([0, 0, 0, 0]);
  const [disable, setDisable] = useState(true);
  const storedEmail = localStorage.getItem("email");
  let storedOTP = localStorage.getItem("otp");


  function resendOTP() {
    // Obtener el email y el OTP del localStorage
    const OTPNuevo = Math.floor(Math.random() * 9000 + 1000);
    localStorage.setItem("otp", OTPNuevo.toString());
    storedOTP = localStorage.getItem("otp");
    console.log("otp: " +storedOTP + " email: " + storedEmail);
    axios
      .post(`${base_url}persona/send_recovery_email`, {
        OTP: OTPNuevo,
        recipient_email: storedEmail,
      })
      .then(() => {
        setDisable(true);
        alert("Nuevo código enviado exitosamente a su correo no olvides revisar spam si no lo vez en la bandeja principal");
        setTimer(5);
      })
      .catch(console.log);
  }
  

  function verfiyOTP() {
  //  console.log("otp: :) "+otp+"email: "+ setEmail);
    if (parseInt(OTPinput.join("")) === parseInt(storedOTP)) {
      navigate("/nueva-contrasenia");
      return;
    }
    alert(
      "El código ingresado no es correcto, intenta de nuevo o reenvio de código"
    );
    return;
  }

  React.useEffect(() => {
    let interval = setInterval(() => {
      setTimer((lastTimerCount) => {
        lastTimerCount <= 1 && clearInterval(interval);
        if (lastTimerCount <= 1) setDisable(false);
        if (lastTimerCount <= 0) return lastTimerCount;
        return lastTimerCount - 1;
      });
    }, 1000); //each count lasts for a second
    //cleanup the interval on complete
    return () => clearInterval(interval);
  }, [disable]);

  return (
    <div className="containerColor">
    <div className="container">
      <div className="card">
        <div className="title">Email Verification</div>
        <div className="description">Hemos enviado un codigo a tu correo electronico. {storedEmail}</div>
        <form>
          <div className="inputs-container">
            <div className="input-group">
             
              <input
                maxLength="1"
                className="input"
                type="text"
                name=""
                id=""
                onChange={(e) =>
                  setOTPinput([
                    e.target.value,
                    OTPinput[1],
                    OTPinput[2],
                    OTPinput[3],
                  ])
                }
              ></input>
              <input
                maxLength="1"
                className="input"
                type="text"
                name=""
                id=""
                onChange={(e) =>
                  setOTPinput([
                    OTPinput[0],
                    e.target.value,
                    OTPinput[2],
                    OTPinput[3],
                  ])
                }
              ></input>
              <input
                maxLength="1"
                className="input"
                type="text"
                name=""
                id=""
                onChange={(e) =>
                  setOTPinput([
                    OTPinput[0],
                    OTPinput[1],
                    e.target.value,
                    OTPinput[3],
                  ])
                }
              ></input>
              <input
                maxLength="1"
                className="input"
                type="text"
                name=""
                id=""
                onChange={(e) =>
                  setOTPinput([
                    OTPinput[0],
                    OTPinput[1],
                    OTPinput[2],
                    e.target.value,
                  ])
                }
              ></input>
            </div > 
            
            <button
              onClick={() => verfiyOTP()}
              className="verify-btn"
            >
              Verificar Cuenta
            </button>
          </div>
          <div className="resend-container">
            <p className="resend-text">No recibiste el codigo?</p>{" "}
            <p
              className="resend-link"
              style={{
                color: disable ? "gray" : "blue",
                cursor: disable ? "none" : "pointer",
                textDecorationLine: disable ? "none" : "underline",
              }}
              onClick={() => resendOTP()}
            >
              {disable ? `Reenviar codigo OTP en ${timerCount}s` : "Reenviar OTP"}
            </p>
            
          </div>
        </form>
      </div>
    </div>
    </div>
  );
}
