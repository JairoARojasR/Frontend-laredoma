import React, { useEffect, useState } from "react";
import { Bar, Pie, Line, Doughnut } from "react-chartjs-2";
import { useSelector, useDispatch } from "react-redux";
import dayjs from "dayjs";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  LineElement,
  Title,
  Legend,
  Tooltip,
  ArcElement,
} from "chart.js";
import { getVentas } from "../features/venta/ventaSlice";
import {
  createProducts,
  resetState,
  updateAProduct,
  getAProduct,
  getProducts,
} from "../features/producto/productoSlice";
import { getCategorias } from "../features/categoria/categoriaSlice";

// Registrar todos los elementos necesarios en ChartJS
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const ResumenVentas = () => {
  const [ventasPorFecha, setVentasPorFecha] = useState({});
  const [ventasPorProducto, setVentasPorProducto] = useState({});
  const [ventasSemanales, setVentasSemanales] = useState({});
  const [ventasPorCategoria, setVentasPorCategoria] = useState({});
  const [totalVentas, setTotalVentas] = useState(0); // Estado para almacenar el total de ventas
  const ventas = useSelector((state) => state.venta.ventas);
  const productoState = useSelector((state) => state.producto.products);
  const catState = useSelector((state) => state.categoria.categorias);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getVentas());
    dispatch(getProducts());
    dispatch(getCategorias());
  }, [dispatch]);

  useEffect(() => {
    console.log("Ventas cargadas:", ventas);
    generateVentasPorFecha(ventas);
    generateVentasPorProducto(ventas);
    generateVentasSemanales(ventas);
    generateVentasPorCategoria(ventas);
    calculateTotalVentas(ventas); // Calcular el total de ventas cuando cambian las ventas
  }, [ventas]);

  const generateVentasPorFecha = (ventas) => {
    const ventasPorFecha = {};
    ventas.forEach((item) => {
      const fecha = dayjs(item.venta.fecha).format("DD-MM-YYYY");
      if (ventasPorFecha[fecha]) {
        ventasPorFecha[fecha] += item.venta.total_venta;
      } else {
        ventasPorFecha[fecha] = item.venta.total_venta;
      }
    });
    setVentasPorFecha(ventasPorFecha);
  };

  const generateVentasPorProducto = (ventas) => {
    const ventasPorProducto = {};
    const productoMap = productoState.reduce((acc, producto) => {
      acc[producto._id] = producto.nombre;
      return acc;
    }, {});

    ventas.forEach((item) => {
      item.productos_vendidos.forEach((productoVendido) => {
        const productoNombre = productoMap[productoVendido.id_producto] || "Desconocido";
        const totalVentaProducto = productoVendido.precio * productoVendido.cantidad;  
        if (ventasPorProducto[productoNombre]) {
          ventasPorProducto[productoNombre] += totalVentaProducto;
        } else {
          ventasPorProducto[productoNombre] = totalVentaProducto;
        }
      });
    });
    setVentasPorProducto(ventasPorProducto);
  };

  const generateVentasSemanales = (ventas) => {
    const ventasSemanales = {};
    ventas.forEach((item) => {
      const semana = dayjs(item.venta.fecha).week();
      if (ventasSemanales[semana]) {
        ventasSemanales[semana] += item.venta.total_venta;
      } else {
        ventasSemanales[semana] = item.venta.total_venta;
      }
    });
    setVentasSemanales(ventasSemanales);
  };

  const generateVentasPorCategoria = (ventas) => {
    const ventasPorCategoria = {};
    const categoriaMap = productoState.reduce((acc, producto) => {
      const categoria = catState.find(cat => cat._id === producto.categoria);
      if (categoria) {
        acc[producto._id] = categoria.nombre;
      } else {
        acc[producto._id] = "Desconocida"; // Manejar categorías no encontradas
      }
      return acc;
    }, {});

    ventas.forEach((item) => {
      item.productos_vendidos.forEach((productoVendido) => {
        const categoria = categoriaMap[productoVendido.id_producto] || "Desconocida";
        const totalVentaProducto = productoVendido.precio * productoVendido.cantidad;
        if (ventasPorCategoria[categoria]) {
          ventasPorCategoria[categoria] += totalVentaProducto;
        } else {
          ventasPorCategoria[categoria] = totalVentaProducto;
        }
      });
    });

    setVentasPorCategoria(ventasPorCategoria);
  };

  const calculateTotalVentas = (ventas) => {
    let total = 0;
    ventas.forEach((item) => {
      total += item.venta.total_venta;
    });
    setTotalVentas(total);
  };

  const chartData = {
    labels: Object.keys(ventasPorFecha),
    datasets: [
      {
        label: "Total Venta por Fecha",
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 1,
        hoverBackgroundColor: "rgba(75,192,192,0.6)",
        hoverBorderColor: "rgba(75,192,192,1)",
        data: Object.values(ventasPorFecha),
      },
    ],
  };

  const pieData = {
    labels: Object.keys(ventasPorProducto),
    datasets: [
      {
        label: "Total Venta por Producto",
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
        hoverBackgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
        data: Object.values(ventasPorProducto),
      },
    ],
  };

  const lineData = {
    labels: Object.keys(ventasSemanales),
    datasets: [
      {
        label: "Ventas Semanales",
        fill: false,
        lineTension: 0.1,
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
        borderCapStyle: "butt",
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: "miter",
        pointBorderColor: "rgba(75,192,192,1)",
        pointBackgroundColor: "#fff",
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "rgba(75,192,192,1)",
        pointHoverBorderColor: "rgba(220,220,220,1)",
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: Object.values(ventasSemanales),
      },
    ],
  };

  const doughnutData = {
    labels: Object.keys(ventasPorCategoria),
    datasets: [
      {
        label: "Total Venta por Categoría",
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
        hoverBackgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
        data: Object.values(ventasPorCategoria),
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="container">

    <h1 className="mb-4">Total de Ventas: ${totalVentas}</h1>


      <h1 className="mb-4">Resumen de Ventas por Fecha</h1>

      <div className="bar-chart-container mb-4">
        <Bar data={chartData} options={options} />
      </div>

      <h2 className="mb-4">Distribución de Ventas por Producto</h2>

      <div className="pie-chart-container mb-4">
        <Pie data={pieData} />
      </div>

      <h2 className="mb-4">Distribución de Ventas por Categoría</h2>

      <div className="doughnut-chart-container mb-4">
        <Doughnut data={doughnutData} />
      </div>

      <h1 className="mb-4">Total de Ventas: ${totalVentas}</h1>
    </div>
  );
};

export default ResumenVentas;
