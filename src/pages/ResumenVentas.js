import React, { useEffect, useState } from "react";
import { Bar, Pie, Line, Doughnut } from "react-chartjs-2";
import { useSelector, useDispatch } from "react-redux";
import "../styles/ResumenVentas.css";
import VentasSVG from '../images/money-bill.svg'; // Asegúrate de que la ruta sea correcta
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
  getUsers,
  getAUser,
  deleteAUser,
} from "../features/usuario/usuarioSlice";
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
  const [manoDeObraPorMecanico, setManoDeObraPorMecanico] = useState({});
  const [totalVentas, setTotalVentas] = useState(0); // Estado para almacenar el total de ventas
  const ventas = useSelector((state) => state.venta.ventas);
  const productoState = useSelector((state) => state.producto.products);
  const catState = useSelector((state) => state.categoria.categorias);
  const userState = useSelector((state) => state.user.users);
  const [totalManoDeObra, setTotalManoDeObra] = useState(0); 
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getVentas());
    dispatch(getProducts());
    dispatch(getCategorias());
    dispatch(getUsers())
  }, [dispatch]);

  useEffect(() => {
    console.log("Ventas cargadas:", ventas);
    generateVentasPorFecha(ventas);
    generateVentasPorProducto(ventas);
    generateVentasSemanales(ventas);
    generateVentasPorCategoria(ventas);
    generateManoDeObraPorMecanico(ventas); // Agregar esta línea para calcular mano de obra por mecánico
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

  const generateManoDeObraPorMecanico = (ventas) => {
    const manoDeObra = {};
    let totalManoDeObra = 0;
    
    ventas.forEach((item) => {
      item.servicios_prestados.forEach((servicio) => {
        const fecha = dayjs(item.venta.fecha).format("DD-MM-YYYY");
        const mecanico = userState.find(usuario => usuario._id === servicio.id_mecanico);
        const precioMObra = servicio.precio_manoDeObra;
        totalManoDeObra += precioMObra; // Sumar al total de mano de obra
        
        if (!manoDeObra[fecha]) {
          manoDeObra[fecha] = {};
        }
        if (manoDeObra[fecha][mecanico]) {
          manoDeObra[fecha][mecanico.nombre] += precioMObra;
        } else {
          manoDeObra[fecha][mecanico.nombre] = precioMObra;
        }
      });
    });
  
    setManoDeObraPorMecanico(manoDeObra);
    setTotalManoDeObra(totalManoDeObra); // Actualizar el estado del total de mano de obra
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
        acc[producto._id] = "Desconocida"; 
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
  
  const colors = [
    "rgba(255, 99, 132, 0.6)",
    "rgba(54, 162, 235, 0.6)",
    "rgba(255, 206, 86, 0.6)",
    "rgba(75, 192, 192, 0.6)",
    "rgba(153, 102, 255, 0.6)",
    "rgba(255, 159, 64, 0.6)",
    // Añade más colores si tienes más mecánicos
  ];
  
  const borderColors = [
    "rgba(255, 99, 132, 1)",
    "rgba(54, 162, 235, 1)",
    "rgba(255, 206, 86, 1)",
    "rgba(75, 192, 192, 1)",
    "rgba(153, 102, 255, 1)",
    "rgba(255, 159, 64, 1)",
    // Añade más colores si tienes más mecánicos
  ];
  
  const manoDeObraData = {
    labels: Object.keys(manoDeObraPorMecanico),
    datasets: manoDeObraPorMecanico
      ? Object.keys(manoDeObraPorMecanico[Object.keys(manoDeObraPorMecanico)[0]] || {}).map((mecanicoId, index) => ({
          label: mecanicoId,
          backgroundColor: colors[index % colors.length],
          borderColor: borderColors[index % borderColors.length],
          borderWidth: 1,
          hoverBackgroundColor: "rgba(75,10,1,0.6)",
          hoverBorderColor: "rgba(75,192,192,1)",
          data: Object.keys(manoDeObraPorMecanico).map(fecha => manoDeObraPorMecanico[fecha][mecanicoId] || 0),
        }))
      : [],
  };
  

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="titulo">
      <h1>ESTADISTICAS DE VENTAS AYS LA REDOMA</h1>
      <div className="totales-container">
        <div className="Ventas-totales">
          <h1>
            <img src={VentasSVG} alt="Ventas" style={{ width: '40px', marginLeft: '20px', marginRight: '10px' }} />
            Total de Ventas: ${totalVentas.toLocaleString('es-ES')}
          </h1>
        </div>
        <div className="ManoDeObra-totales">
          <h1>
            <img src={VentasSVG} alt="Mano de Obra" style={{ width: '40px', marginLeft: '20px', marginRight: '10px' }} />
            Total Mano de Obra: ${totalManoDeObra.toLocaleString('es-ES')}
          </h1>
        </div>
      </div>
      <div className="container">
        <div className="grid-container">
          <div className="chart-container">
            <h2 className="mb-4">Resumen de Ventas por Fecha</h2>
            <Bar data={chartData} options={options} />
          </div>
          <div className="chart-container">
            <h2 className="mb-4">Mano de Obra por Mecánico</h2>
            <Bar data={manoDeObraData} options={options} />
          </div>
          <div className="chart-container">
            <h2 className="mb-4">Distribución de Ventas por Producto</h2>
            <Pie data={pieData} />
          </div>
          <div className="chart-container">
            <h2 className="mb-4">Distribución de Ventas por Categoría</h2>
            <Doughnut data={doughnutData} />
          </div>
        </div>
      </div>
    </div>
  );
  
  
};

export default ResumenVentas;