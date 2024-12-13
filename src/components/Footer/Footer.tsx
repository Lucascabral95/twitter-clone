import React from "react";
import "./Footer.scss";
import { FaGithub, FaLinkedin, FaInstagramSquare } from "react-icons/fa";

const Footer: React.FC = () => {
  return (
    <div className="footer">
      <div className="footer-contenedor">
        <div className="secciones">
          <div className="seccion seccion-de-iconos">
            <a target="_blank" rel="noopener noreferrer" href="https://github.com/Lucascabral95" className="icono">
              <FaGithub className="icon" />
            </a>
            <a target="_blank" rel="noopener noreferrer" href="https://www.linkedin.com/in/lucas-gast%C3%B3n-cabral/" className="icono">
              <FaLinkedin className="icon" />
            </a>
            <a target="_blank" rel="noopener noreferrer" href="https://instagram.com/LucasCabral95" className="icono">
              <FaInstagramSquare className="icon" />
            </a>
          </div>
          <div className="seccion">
            <p> 2024 <a className="link-mi-perfil" href="https://www.github.com/Lucascabral95" rel="noopener noreferrer" target="_blank" >Lucas Cabral Dev</a> | Todos los derechos reservados. </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
