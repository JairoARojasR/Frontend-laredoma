import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import CustomTable from "../components/CustomTable";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Legend,
  Tooltip,
} from "chart.js";
import Chart from 'chart.js/auto';
import { useDispatch } from "react-redux";


import { getVentas } from "../features/venta/ventaSlice";

const ResumenVentas = () => {
  const [ventasPorFecha, setVentasPorFecha] = useState({});
  const ventas = useSelector((state) => state.venta.ventas);

  const dispatch = useDispatch();

    
  useEffect(() => {
    dispatch(getVentas());
  }, [dispatch]);


  useEffect(() => {
    console.log("Ventas cargadas:", ventas); // Puedes eliminar este console.log si ya no lo necesitas
    generateVentasPorFecha(ventas);
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

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );

  return (
    <div className="container">
      <h1 className="mb-4">Resumen de Ventas por Fecha</h1>

      <div className="bar-chart-container mb-4">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default ResumenVentas;
