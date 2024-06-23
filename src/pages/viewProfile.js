import React, { useEffect, useState } from "react";
import { Button, Form, Input, Typography, message } from "antd";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import "../components/CustomInput.css";
import { Link } from "react-router-dom";
import { base_url } from "../utils/baseUrl";
import { getAUser, updateUserByEmail } from "../features/usuario/usuarioSlice";

const { Title } = Typography;

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};

const validateMessages = {
  required: "${label} is required!",
  types: {
    email: "${label} is not a valid email!",
    number: "${label} is not a valid number!",
  },
};

const ViewProfileAdmin = () => {
  const user = useSelector((state) => state.user.users);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [correobus, setcorreobus] = useState("");
  const [rol, setrol] = useState("");
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user && user.token) {
        try {
          const response = await axios.get(
            `${base_url}persona/getTokenData/${user.token}`
          );
          const id = response.data.data.id;
          const action = await dispatch(getAUser(id));
          const userData = action.payload;
          setcorreobus(userData.correo);
          console.log("userData", userData); 
          setrol(userData.id_rol);
          const correo = userData.correo;
          const nombre = userData.nombre;
          const cedula = userData.cedula;
        
          form.setFieldsValue({
            correo: correo,
            nombre: nombre,
            cedula: cedula,
          });
          setFormData({ correo, nombre });
        } catch (error) {
          console.error("Error al obtener los datos del usuario:", error);
        }
      }
    };

    fetchUserData();
  }, [dispatch, form]);

  const onFinish = async (values) => {
    const updatedUser = {
      userData: {
        ...values,
        correobus: correobus
      },
    };
    console.log("lo que pasa en el update", updatedUser);
    try {
      await dispatch(updateUserByEmail(updatedUser));
      message.success("¡Tus datos han sido actualizados exitosamente!");
      window.location.reload();
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
    }
  };

  return (
    <div style={{ background: "#fff", padding: 24, minHeight: "100vh" }}>
      <h3 className="mb-4  title">
        Este es tu perfil:
      </h3>
      <Form
        {...layout}
        name="nest-messages"
        onFinish={onFinish}
        form={form}
        validateMessages={validateMessages}
      >
        <label>Nombre</label>
        <Form.Item
          name="nombre"
          rules={[
            {
              required: true,
              message: "Por favor ingresa tu nombre",
            },
          ]}
        >
          <Input disabled={rol !== "Vendedor"} />
        </Form.Item>
        <label>Cédula</label>
        <Form.Item
          name="cedula"
          rules={[
            {
              required: true,
              message: "Por favor ingresa una cedula",
            },
          ]}
        >
         <Input disabled={rol !== "Vendedor"} />
        </Form.Item>
        <label>Correo</label>
        <Form.Item
          name="correo"
          rules={[
            {
              type: "email",
              message: "Por favor ingresa un correo válido",
            },
            {
              required: true,
              message: "Por favor ingresa tu correo",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          wrapperCol={{
            ...layout.wrapperCol,
            offset: 8,
          }}
        >
          <Button type="primary" htmlType="submit">
            Guardar Datos
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ViewProfileAdmin;