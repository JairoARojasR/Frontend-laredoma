import React, { useEffect, useState } from "react";
import { Form, Input, InputNumber, Popconfirm, Table, Typography, Switch, Space, Button, Modal } from 'antd';
import { BiEdit } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {EditOutlined, CheckOutlined, CloseOutlined } from "@ant-design/icons";
import rolService from "../features/rol/rolService";
import productService from "../features/producto/productoService";
import { createRol, deleteRol, getRol,getRoles, resetState, updateRol } from "../features/rol/rolSlice";
import CustomModal from "../components/CustomModal";
import { unwrapResult } from '@reduxjs/toolkit';
import {getUsers} from "../features/usuario/usuarioSlice";
import "../styles/Botones.css"
import ButtonCustom from "../components/ButtonCustom";

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[{ required: true, message: `Please Input ${title}!` }]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};


const Rollist = () => {
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState('');
  const [open, setOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pCatId, setpCatId] = useState("");
  const [newRolName, setNewRolName] = useState("");
  const dispatch = useDispatch();
  const userState = useSelector((state) => state.user.users)
  const showModal = (categoryId) => {
    setOpen(true);
    setpCatId(categoryId);
  };

  const hideModal = () => {
    setOpen(false);
  };

  const handleSwitchChange = async (categoryId, property, checked) => {
    try {
      await rolService.updateRol({
        id: categoryId,
        pCatData: {
          [property]: checked,
        },
      });
      dispatch(getRoles());

      const message = checked
        ? `La categoría está ${property} actualmente`
        : `La categoría no está ${property} actualmente`;

      toast.success(message);
    } catch (error) {
      const errorMessage = `Error al cambiar el estado de ${property} del rol`;
      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    dispatch(resetState());
    dispatch(getRoles());
    dispatch(getUsers());
  }, [dispatch]);

  const roles = useSelector((state) => state.rol.roles);
  const data = roles.map((rol, index) => ({
    key: rol._id,
    // nombre: (
    //   <Link to={`/admin/categoria/${categoria.nombre}/productos`}>
    //     {categoria.nombre}
    //   </Link>
    // ),
    nombre: rol.nombre,
    estado: (
      <Space direction="vertical">
        <Switch
          checkedChildren={<CheckOutlined />}
          unCheckedChildren={<CloseOutlined />}
          defaultChecked={rol.activo}
          onChange={(checked) =>
            handleSwitchChange(rol._id, "activo", checked)
          }
        />
      </Space>
    ),
    action: (
      <>
        <Link
          to={`/admin/rol/${rol._id}`}
          className=" fs-3 text-danger"
        >
          <BiEdit />
        </Link>
        <button
          className="ms-3 fs-3 text-danger bg-transparent border-0"
          onClick={() => showModal(rol._id)}
        >
          <AiFillDelete />
        </button>
      </>
    ),
  }));

  const isEditing = (record) => record.key === editingKey;

  const edit = (record) => {
    form.setFieldsValue({ nombre: '', ...record });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const resultAction = await dispatch(updateRol({ id: key, pCatData: row }));
      const result = unwrapResult(resultAction);

      setEditingKey('');
      if (resultAction.type.endsWith('fulfilled')) {
        toast.success('Rol actualizado exitosamente!');
      } 
      dispatch(getRoles());
    } catch (errInfo) {
      toast.error("El Rol ya existe")
    }
  };

  const handleOk = async () => {
    if (!newRolName.trim()) {
      toast.error("El nombre del rol no puede estar vacío.");
      return;
    }
    
    try {
      await dispatch(createRol({ nombre: newRolName }));
      setIsModalOpen(false);
      setNewRolName("");
      dispatch(getRoles()); // Refresh the data after adding
      toast.success('Rol agregado exitosamente!');
    } catch (error) {
      console.error("Error al agregar el rol:", error);
      toast.error("Error al agregar el rol.");
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const columns = [
    { title: 'Nombre', dataIndex: 'nombre', width: '25%', editable: true },
    {
      title: 'Estado', dataIndex: 'estado', width: '15%',
    },
    {
      title: 'Operación', dataIndex: 'action', width: '35%',
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link onClick={() => save(record.key)} style={{ marginRight: 8 }}>
              Guardar
            </Typography.Link>
            <Popconfirm title="¿Seguro de cancelar?" onConfirm={cancel} okText="Sí" cancelText="No">
              <a>Cancelar</a>
            </Popconfirm>
          </span>
        ) : (
          <span>
            <ButtonCustom
              icon={<EditOutlined />}
              onClick={() => edit(record)}
              disabled={editingKey !== ''}
              type="primary"
              style={{ marginRight: 8 }}
            />
            <Popconfirm title="¿Seguro de eliminar?" onConfirm={() => handledeleteCategory(record.key)} okText="Sí" cancelText="No">
              <button className="square-button">
                <AiFillDelete />
              </button>
            </Popconfirm>
          </span>
        );
      },
    },
  ];
  
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === 'estado' ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });


  const handledeleteCategory = async (categoryId) => {
    try {
      const usersWithRole = userState.filter(user => user.id_rol === categoryId);

      if (usersWithRole.length > 0) {
        toast.error(
          `No se puede eliminar el rol porque está asociado a ${usersWithRole.length} usuarios.`
        );
        return;
      } else {
        await dispatch(deleteRol(categoryId));
        setOpen(false);
        dispatch(getRoles());
        toast.success("Rol eliminada exitosamente!");
      }
    } catch (error) {
      console.error("Error al intentar eliminar el rol:", error);
      toast.error("Error al intentar eliminar el rol.");
    }
  };

  return (
    <div>
      <h3 className="mb-4 title">Lista de Roles</h3>
      <Button type="primary" onClick={() => setIsModalOpen(true)} style={{ marginBottom: 16 }}>
        Agregar Rol
      </Button>
      <Form form={form} component={false}>
        <Table
          components={{ body: { cell: EditableCell } }}
          dataSource={data}
          bordered
          columns={mergedColumns}
          rowClassName="editable-row"
          pagination={{ onChange: cancel }}
        />
      </Form>
      <CustomModal
        hideModal={hideModal}
        open={open}
        performAction={() => handledeleteCategory(pCatId)}
        title="¿Estás seguro de que quieres eliminar el rol?"
      />
      <Modal
        title="Agregar Rol"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Agregar" cancelText="Cancelar"
      >
        <Form layout="vertical">
          <Form.Item label="Nombre" required>
            <Input value={newRolName} onChange={(e) => setNewRolName(e.target.value)} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Rollist;