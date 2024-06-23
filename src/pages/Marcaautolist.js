import React, { useEffect, useState } from "react";
import { Form, Input, InputNumber, Popconfirm, Table, Typography, Switch, Space, Button, Modal } from 'antd';
import { EditOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { BiEdit } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import marcaService from "../features/marca_auto/marcaautoService";
import productService from "../features/producto/productoService";
import { deleteMarcaauto, getMarcasauto, resetState, updateMarcaauto, createMarcaauto } from "../features/marca_auto/marcaautoSlice";
import CustomModal from "../components/CustomModal";
import { unwrapResult } from '@reduxjs/toolkit';

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

const Marcaautolist = () => {
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState('');
  const [open, setOpen] = useState(false);
  const [pCatId, setpCatId] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMarcaName, setNewMarcaName] = useState("");
  const dispatch = useDispatch();
  const newMarca = useSelector((state) => state.marcaauto);
  const {
    isSuccess,
    isError,
    message,
  } = newMarca;

  const showModal = (categoryId) => {
    setOpen(true);
    setpCatId(categoryId);
  };

  const hideModal = () => {
    setOpen(false);
  };
 
  const handleSwitchChange = async (categoryId, property, checked) => {
    try {
      await marcaService.updateMarcaauto({
        id: categoryId,
        marcaData: {
          [property]: checked,
        },
      });
      dispatch(getMarcasauto());

      const message = checked
        ? `La marca de auto está ${property} actualmente`
        : `La marca de auto no está ${property} actualmente`;

      toast.success(message);
    } catch (error) {
      const errorMessage = `Error al cambiar el estado de ${property} de la marca de auto`;
      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    dispatch(resetState());
    dispatch(getMarcasauto());
  }, [dispatch]);

  const marcas = useSelector((state) => state.marcaauto.marcas);
  const dataaux = marcas.map((categoria) => ({
    key: categoria._id,
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
      // Dispatch update action and unwrap result
      const resultAction = await dispatch(updateMarcaauto({ id: key, marcaData: row }));
      const result = unwrapResult(resultAction);

      setEditingKey('');

      if (resultAction.type.endsWith('fulfilled')) {
        toast.success('Marca de auto actualizada exitosamente!');
      } 
      dispatch(getMarcasauto());
    } catch (errInfo) {
      toast.error("La marca de auto ya existe")
    }
  };

  const handledeleteMarcaauto = async (marcaId) => {
    try {
      const productsInMarca = await productService.getProductByMarca(marcaId);

      if (productsInMarca.length > 0) {
        toast.error(
          `No se puede eliminar la marca de auto porque está asociada a ${productsInMarca.length} productos.`
        );
      } else {
        await dispatch(deleteMarcaauto(marcaId));
        setOpen(false);
        dispatch(getMarcasauto());
        toast.success("Marca de auto eliminada exitosamente!");
      }
    } catch (error) {
      console.error("Error al intentar eliminar la marca de auto:", error);
      toast.error("Error al intentar eliminar la marca de auto.");
    }
  };

  const handleOk = async () => {
    if (!newMarcaName.trim()) {
      toast.error("El nombre de la marca no puede estar vacío.");
      return;
    }
    try {
      const resultAction = await dispatch(createMarcaauto({ nombre: newMarcaName }));
      if (resultAction.type.endsWith('fulfilled')) {
      setIsModalOpen(false);
      setNewMarcaName("");
      dispatch(getMarcasauto()); // Refresh the data after adding
      toast.success('Marca de auto agregada exitosamente!');
    } else {
      throw new Error("Unknown error");
    }
  } catch (error) {
    if (error.message.includes("already exists")) {
      toast.error("La Marca de auto ya existe");
    } else {
      toast.error("La Marca de auto ya existe");
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
            <Button
              icon={<EditOutlined />}
              onClick={() => edit(record)}
              disabled={editingKey !== ''}
              type="primary"
              style={{ marginRight: 8 }}
            />
            <Popconfirm title="¿Seguro de eliminar?" onConfirm={() => handledeleteMarcaauto(record.key)} okText="Sí" cancelText="No">
              <button className="ms-3 fs-3 text-danger bg-transparent border-0">
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

  return (
    <div>
      <h3 className="mb-4 title">Lista de Marcas de Autos</h3>
      <Button type="primary" onClick={() => setIsModalOpen(true)} style={{ marginBottom: 16 }}>
        Agregar Marca
      </Button>
      <Form form={form} component={false}>
        <Table
          components={{ body: { cell: EditableCell } }}
          dataSource={dataaux}
          bordered
          columns={mergedColumns}
          rowClassName="editable-row"
          pagination={{ onChange: cancel }}
        />
      </Form>
      <CustomModal
        hideModal={hideModal}
        open={open}
        performAction={() => handledeleteMarcaauto(pCatId)}
        title="¿Estás seguro de que quieres eliminar la marca de auto?"
      />
      <Modal
        title="Agregar Marca de Auto"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Agregar" cancelText="Cancelar"
      >
        <Form layout="vertical">
          <Form.Item label="Nombre" required>
            <Input value={newMarcaName} onChange={(e) => setNewMarcaName(e.target.value)} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Marcaautolist;
