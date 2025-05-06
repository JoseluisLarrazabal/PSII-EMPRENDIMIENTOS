import { useState, useEffect } from "react";
import axios from "axios";
import dayjs from "dayjs";
import "dayjs/locale/es";
 
dayjs.locale("es");
 
const meses = [
  "ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO",
  "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"
];
 
export default function Eventos() {
  const [mesActivo, setMesActivo] = useState("ENERO");
  const [showModal, setShowModal] = useState(false);
  const [modalMensaje, setModalMensaje] = useState("");
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);
 
  const [eventos, setEventos] = useState([]);
 
  useEffect(() => {
    obtenerEventos();
  }, []);
 
  const obtenerEventos = async () => {
    try {
const res = await axios.get("http://localhost:3001/api/eventos");
      setEventos(res.data);
    } catch (error) {
      console.error("Error al obtener eventos:", error);
    }
  };
 
  const seleccionarEvento = (evento) => {
    setEventoSeleccionado(evento);
  };
 
  const registrarAsistencia = async () => {
    try {
      // Aquí puedes enviar la asistencia a tu API si ya está implementada
// await axios.post("http://localhost:3001/api/asistencias", { evento_id: eventoSeleccionado.id });
      setModalMensaje("¡Asistencia registrada!");
      setShowModal(true);
      setTimeout(() => setShowModal(false), 2000);
    } catch (error) {
      console.error("Error al registrar asistencia:", error);
    }
  };
 
  const eventosPorMes = (mes) => {
    return eventos.filter((evento) => {
      const mesEvento = dayjs(evento.fecha_evento).format("MMMM").toUpperCase();
      return mesEvento === mes;
    });
  };
 
  return (
    <div className="min-h-screen bg-gray-100 p-5 flex flex-col lg:flex-row gap-6">
      <div className="w-full lg:w-1/2 px-10">
        <h2 className="text-3xl font-bold text-center mb-8">EVENTOS 2025</h2>
        <div className="relative w-full max-w-3xl mx-auto">
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-cyan-500 rounded"></div>
          {meses.map((mes, index) => (
            <div
              key={mes}
              className={`relative w-full flex ${index % 2 === 0 ? "justify-start pr-20" : "justify-end pl-20"} mb-8`}
            >
              <div className="w-64">
                <div
                  className="px-4 py-2 bg-cyan-500 text-white text-sm font-semibold rounded-md hover:bg-cyan-600 transition cursor-pointer text-center"
                  onClick={() => setMesActivo((prev) => (prev === mes ? "" : mes))}
                >
                  {mes}
                </div>
 
                {mesActivo === mes && (
                  <div className="bg-white mt-2 p-4 text-sm rounded shadow border border-gray-200">
                    <div className="font-semibold text-gray-800">Eventos:</div>
                    <ul className="list-disc list-inside text-gray-700">
                      {eventosPorMes(mes).length > 0 ? (
                        eventosPorMes(mes).map((evento) => (
                          <li
key={evento.id}
                            className="cursor-pointer hover:text-cyan-600"
                            onClick={() => seleccionarEvento(evento)}
                          >
                            <strong>{evento.titulo}</strong> – {dayjs(evento.fecha_evento).format("DD/MM/YYYY")} – {evento.lugar}
                          </li>
                        ))
                      ) : (
                        <li>No hay eventos para este mes.</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
 
      <div className="w-full lg:w-2/3 bg-[#880043] shadow rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {eventoSeleccionado ? "DETALLES DEL EVENTO" : "SELECCIONA UN EVENTO"}
        </h2>
 
        {eventoSeleccionado ? (
          <div className="space-y-4">
            <p><strong>Título:</strong> {eventoSeleccionado.titulo}</p>
            <p><strong>Descripción:</strong> {eventoSeleccionado.descripcion}</p>
            <p><strong>Fecha:</strong> {dayjs(eventoSeleccionado.fecha_evento).format("DD [de] MMMM [de] YYYY")}</p>
            <p><strong>Hora:</strong> {eventoSeleccionado.hora}</p>
            <p><strong>Lugar:</strong> {eventoSeleccionado.lugar}</p>
 
            <button
              onClick={registrarAsistencia}
              className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
            >
              Registrar Asistencia
            </button>
          </div>
        ) : (
          <p className="text-center">Haz clic en un evento para ver sus detalles y registrar asistencia.</p>
        )}
      </div>
 
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg text-center">
            <h2 className="text-xl font-bold mb-2 text-green-700">{modalMensaje}</h2>
            <p>La operación se completó correctamente.</p>
          </div>
        </div>
      )}
    </div>
  );
}