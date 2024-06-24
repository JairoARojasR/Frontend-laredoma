import React, { useEffect, useState } from "react";
import { Form, Input, InputNumber, Popconfirm, Table, Typography, Switch, Space, Button, Modal } from 'antd';
import { BiEdit } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {EditOutlined, CheckOutlined, CloseOutlined } from "@ant-design/icons";
import categoryService from "../features/categoria/categoriaService";
import productService from "../features/producto/productoService";
import { createCategoria, deleteCategoria, getCategorias, resetState, updateCategoria } from "../features/categoria/categoriaSlice";
import CustomModal from "../components/CustomModal";
import { unwrapResult } from '@reduxjs/toolkit';
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


const Categorylist = () => {
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState('');
  const [open, setOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pCatId, setpCatId] = useState("");
  const [newCategoriaName, setNewCategoriaName] = useState("");
  const dispatch = useDispatch();

  const showModal = (categoryId) => {
    setOpen(true);
    setpCatId(categoryId);
  };

  const hideModal = () => {
    setOpen(false);
  };

  const handleSwitchChange = async (categoryId, property, checked) => {
    try {
      await categoryService.updateCategoria({
        id: categoryId,
        pCatData: {
          [property]: checked,
        },
      });
      dispatch(getCategorias());

      const message = checked
        ? `La categoría está ${property} actualmente`
        : `La categoría no está ${property} actualmente`;

      toast.success(message);
    } catch (error) {
      const errorMessage = `Error al cambiar el estado de ${property} de la categoría`;
      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    dispatch(resetState());
    dispatch(getCategorias());
  }, [dispatch]);

  const categorias = useSelector((state) => state.categoria.categorias);
  const data = categorias.map((categoria, index) => ({
    key: categoria._id,
    // nombre: (
    //   <Link to={`/admin/categoria/${categoria.nombre}/productos`}>
    //     {categoria.nombre}
    //   </Link>
    // ),
    nombre: categoria.nombre,
    estado: (
      <Space direction="vertical">
        <Switch
          checkedChildren={<CheckOutlined />}
          unCheckedChildren={<CloseOutlined />}
          defaultChecked={categoria.activo}
          onChange={(checked) =>
            handleSwitchChange(categoria._id, "activo", checked)
          }
        />
      </Space>
    ),
    action: (
      <>
        <Link
          to={`/admin/categoria/${categoria._id}`}
          className=" fs-3 text-danger"
        >
          <BiEdit />
        </Link>
        <button
          className="ms-3 fs-3 text-danger bg-transparent border-0"
          onClick={() => showModal(categoria._id)}
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
      const resultAction = await dispatch(updateCategoria({ id: key, pCatData: row }));
      setEditingKey('');
      if (resultAction.type.endsWith('fulfilled')) {
        toast.success('Categoria actualizada exitosamente!');
      }
      dispatch(getCategorias());
    } catch (errInfo) {
      toast.error("La Categoria ya existe")
    }
  };


  const handleOk = async () => {
  if (!newCategoriaName.trim()) {
    toast.error("El nombre de la Categoria no puede estar vacío.");
    return;
  }

  try {
    const resultAction = await dispatch(createCategoria({ nombre: newCategoriaName }));
    if (resultAction.type.endsWith('fulfilled')) {
      setIsModalOpen(false);
      setNewCategoriaName("");
      dispatch(getCategorias()); // Refresh the data after adding
      toast.success('Categoria agregada exitosamente!');
    } else {
      throw new Error("Unknown error");
    }
  } catch (error) {
    if (error.message.includes("already exists")) {
      toast.error("La Categoria ya existe");
    } else {
      toast.error("La Categoria ya existe");
    }
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
      const productsInCategory = await productService.getProductByCategory(categoryId);

      if (productsInCategory.length > 0) {
        toast.error(
          `No se puede eliminar la categoria porque está asociada a ${productsInCategory.length} productos.`
        );
      } else {
        await dispatch(deleteCategoria(categoryId));
        setOpen(false);
        dispatch(getCategorias());
        toast.success("Categoría eliminada exitosamente!");
      }
    } catch (error) {
      console.error("Error al intentar eliminar la categoría:", error);
      toast.error("Error al intentar eliminar la categoría.");
    }
  };

  return (
    <div>
      <h3 className="mb-4 title">Lista de Categorias</h3>
      <Button type="primary" onClick={() => setIsModalOpen(true)} style={{ marginBottom: 16 }}>
        Agregar Categoria
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
        title="¿Estás seguro de que quieres eliminar la categoría?"
      />
      <Modal
        title="Agregar Categoria"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Agregar" cancelText="Cancelar"
      >
        <Form layout="vertical">
          <Form.Item label="Nombre" required>
            <Input value={newCategoriaName} onChange={(e) => setNewCategoriaName(e.target.value)} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Categorylist;