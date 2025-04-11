const EventDetail = ({ event, onClose }) => {
    if (!event) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
          <h2 className="text-xl font-bold">{event.title}</h2>
          <p className="text-gray-600">{event.date} - {event.time}</p>
          <p className="text-gray-500 mb-4">{event.location}</p>
          <p className="text-gray-700">{event.description}</p>
          <button
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg"
            onClick={onClose}
          >
            Cerrar
          </button>
        </div>
      </div>
    );
  };
  
  export default EventDetail;
  