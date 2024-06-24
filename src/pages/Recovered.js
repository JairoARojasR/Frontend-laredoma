import React from "react";
import "../styles/recovered.css";

export default function Recovered() {
  return (
    <div className="color">
      <section className="recovered-container">
        <div className="recovered-content">
          <div className="imagen">
            <img
              src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
              className="w-full"
              alt="Sample image"
            />
          </div>
          <div className="text">
            <form>
              <div>
                <h1>
                  Contraseña establecida exitosamente
                </h1>
              </div>

              <div>
              <h2>
                  ¡Bienvenido a Autorepuestos la Redoma!{" "}
                  <a href="/">Volver al inicio</a>
                </h2>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
