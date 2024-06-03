import React from "react";
import { Modal } from "antd";

const CustomModal = (props) => {
  const { open, hideModal, performAction, title } = props;
  return (
    <Modal
      title="Confirmación"
      open={open}
      onOk={performAction}
      onCancel={hideModal}
      okText="Aceptar"
      cancelText="Cancelar"
    >
      <p>{title}</p>
    </Modal>
  );
};

export default CustomModal;
