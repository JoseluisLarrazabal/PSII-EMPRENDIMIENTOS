import React from 'react';
import backgroundImage from './assets/ImagenesContacts-Mentoring/fondo.jpg';

const ContactPage = () => {
  return (
    <div
      className="bg-hero"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="bg-overlay">
        <h2 className="text-2xl font-semibold">¡Es Fácil Contactarnos! Completa el Formulario Aquí</h2>
        <p className="text-stroke">Será un gusto poder atenderte</p>


      </div>

      <div className="flex justify-center items-center py-10 px-4">
        <div className="form-container">
          <form className="space-y-4">
            <input className="form-field" type="text" placeholder="Ej. María Hernández" />
            <input className="form-field" type="email" placeholder="Ej. maria@ejemplo.com" />
            <input className="form-field" type="tel" placeholder="71234567" />
            <select className="form-field">
              <option>- Selecciona -</option>
              <option>Consulta</option>
              <option>Soporte</option>
            </select>
            <textarea className="form-field" placeholder="Escribe tu mensaje..." rows="4"></textarea>

            <button type="submit" className="send-button">Enviar</button>
          </form>
        </div>
      </div>

      <div className="text-center mt-10">
  <div className="social-icons space-x-6">
    <a
      href="https://www.facebook.com/share/16Jc4ZHsDT/?mibextid=wwXIfr"
      target="_blank"
      rel="noopener noreferrer"
    >
      <i className="fab fa-facebook text-black text-3xl hover:text-[#880043] transition" />
    </a>
    <a
      href="https://www.instagram.com/incuvalab?igsh=dm1oOG9oY2luNTd1"
      target="_blank"
      rel="noopener noreferrer"
    >
      <i className="fab fa-instagram text-black text-3xl hover:text-[#880043] transition" />
    </a>
    <a
      href="https://www.youtube.com/@incuvalab_oficial"
      target="_blank"
      rel="noopener noreferrer"
    >
      <i className="fab fa-youtube text-black text-3xl hover:text-[#880043] transition" />
    </a>
    <a
      href="https://www.linkedin.com/company/incuvalab"
      target="_blank"
      rel="noopener noreferrer"
    >
      <i className="fab fa-linkedin text-black text-3xl hover:text-[#880043] transition" />
    </a>
  </div>

  <div className="info-box mt-6">
    <p>
      También podemos estar en contacto a través de nuestras redes sociales.
    </p>
    <p>
      Encuéntranos como: <strong>@incuvalab_oficial</strong>
    </p>
  </div>
</div>


    </div>
  );
};

export default ContactPage;
