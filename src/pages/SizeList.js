import React, { useEffect, useState } from "react";
import { Form, Input, InputNumber, Popconfirm, Table, Typography, Switch} from 'antd';
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import {
  deleteASize,
  getSizes,
  resetState,
  updateASize,
} from "../features/talla/tallaSlice";
import sizeService from "../features/talla/tallaService";
import productService from "../features/producto/productoService";
import { CheckOutlined, CloseOutlined, SkinOutlined } from '@ant-design/icons';
import CustomModal from "../components/CustomModal";

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

const SizeList = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [editingKey, setEditingKey] = useState('');
  const [open, setOpen] = useState(false);
  const [sizeId, setsizeId] = useState("");
  const [selectedGender, setSelectedGender] = useState("elastica");
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(resetState());
    dispatch(getSizes());
  }, [dispatch]);

  const sizeState = useSelector((state) => state.size.sizes);

  useEffect(() => {
    setData(sizeState.map((item, index) => ({
      key: item._id,
      nombre: item.nombre,
      tipoTela: item.tipoTela,
      activo: item.activo,
      index: index + 1,
    })));
  }, [sizeState]);

  const isEditing = (record) => record.key === editingKey;

  const edit = (record) => {
    form.setFieldsValue({ nombre: '', tipoTela: '', ...record });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        setData(newData);
        setEditingKey('');

        // Dispatch update action
        dispatch(updateASize({ id: key, sizeData: row }));
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const handleSwitchChange = async (sizeId, property, checked) => {
    try {
      await sizeService.updateTalla({ id: sizeId, sizeData: { [property]: checked } });
      dispatch(getSizes());

      let message = '';
      if (property === 'activo') {
        message = checked ? 'La talla está activada actualmente' : 'La talla está desactivado actualmente';
      }
      toast.success(message);
    } catch (error) {
      let errorMessage = `Error al cambiar el estado de ${property} de la talla`;
      toast.error(errorMessage);
    }
  };

  const showModal = (e) => {
    setOpen(true);
    setsizeId(e);
  };

  const hideModal = () => {
    setOpen(false);
  };

  const deleteSize = async (sizeId) => {
    try {
      const productsInSize = await productService.getProductBySize(sizeId);

      if (productsInSize.length > 0) {
        toast.error(`No se puede eliminar la talla porque está asociada a ${productsInSize.length} productos.`);
      } else {
        await dispatch(deleteASize(sizeId));
        setOpen(false);
        dispatch(getSizes());
        toast.success("Talla eliminada exitosamente!");
      }
    } catch (error) {
      toast.error("Error al intentar eliminar la talla no tienes permisos.");
    }
  };

  const columns = [
    { title: 'Nombre', dataIndex: 'nombre', width: '25%', editable: true },
    { title: 'Tipo de Tela', dataIndex: 'tipoTela', width: '25%', editable: false },
    {
      title: 'Estado', dataIndex: 'activo', width: '15%',
      render: (_, record) => (
        <Switch
          checkedChildren={<CheckOutlined />}
          unCheckedChildren={<CloseOutlined />}
          defaultChecked={record.activo}
          onChange={(checked) => handleSwitchChange(record.key, 'activo', checked)}
        />
      )
    },
    {
      title: 'Operación', dataIndex: 'operation', width: '35%',
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link onClick={() => save(record.key)} style={{ marginRight: 8 }}>
              Guardar
            </Typography.Link>
            <Popconfirm title="¿Seguro de cancelar?" onConfirm={cancel}>
              <a>Cancelar</a>
            </Popconfirm>
          </span>
        ) : (
          <span>
            <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
              Editar
            </Typography.Link>
            <button className="ms-3 fs-3 text-danger bg-transparent border-0" onClick={() => showModal(record.key)}>
              <i className="bi bi-trash"></i>
            </button>
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
        inputType: col.dataIndex === 'activo' ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  return (
    <div>
      <h3 className="mb-4 title">Lista de Tallas</h3>
      <Form form={form} component={false}>
        <Table
          components={{ body: { cell: EditableCell } }}
          bordered
          dataSource={data.filter((item) => item.tipoTela === selectedGender)}
          columns={mergedColumns}
          rowClassName="editable-row"
          pagination={{ onChange: cancel }}
        />
      </Form>
      <CustomModal
        hideModal={hideModal}
        open={open}
        performAction={() => deleteSize(sizeId)}
        title="¿Estás seguro de que quieres eliminar la talla?"
      />
    </div>
  );
};

export default SizeList;
