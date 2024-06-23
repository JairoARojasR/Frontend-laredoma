import React, { useEffect, useState } from "react";
import { List, Typography, message } from "antd";
import axios from "axios";
import "../components/CustomInput.css";
import { base_url } from "../utils/baseUrl";

const { Title } = Typography;

const ViewProfileAdmin = () => {
  const [notificaciones, setNotificaciones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotificaciones = async () => {
      try {
        const response = await axios.get(`${base_url}notificaciones/`);
        setNotificaciones(response.data);
        setLoading(false);
      } catch (error) {
        message.error("Error al cargar las notificaciones");
        setLoading(false);
      }
    };

    fetchNotificaciones();
  }, []);

  return (
    <div style={{ background: "#fff", padding: 24, minHeight: "100vh" }}>
      <Title level={3}>Notificaciones</Title>
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <List
          itemLayout="horizontal"
          dataSource={notificaciones}
          renderItem={item => (
            <List.Item>
              <List.Item.Meta
                title={`Producto ID: ${item.producto_id}`}
                description={item.mensaje}
              />
            </List.Item>
          )}
        />
      )}
    </div>
  );
};

export default ViewProfileAdmin;
