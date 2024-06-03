import React from "react";
import ReactDOM from "react-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import { reduxConfig } from "./app/reduxConfig";

ReactDOM.render(
  <Provider store={reduxConfig}>
    <ToastContainer 
      autoClose={5000} 
      position="top-right"
      hideProgressBar={false}
      newestOnTop={true}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      theme="light"/>
      
    <App />
  </Provider>,
  document.getElementById("root")
);
