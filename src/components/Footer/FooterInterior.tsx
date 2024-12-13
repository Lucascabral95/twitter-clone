import React from 'react'
import './Footer.scss'
import { FaGithub, FaLinkedin, FaInstagramSquare } from "react-icons/fa";

const FooterInterior: React.FC = () => {
  return (
    <footer className='footer-interior'>
      <div className='contenedor-footer-interior'>
        <div className="iconos">
          <a target='_blank' rel="noopener noreferrer" href='https://github.com/Lucascabral95' className="icono">
            <FaGithub className="icon" />
          </a>
          <a target='_blank' rel="noopener noreferrer" href='https://www.linkedin.com/in/lucas-gast%C3%B3n-cabral/' className="icono">
            <FaLinkedin className="icon" />
          </a>
          <a target='_blank' rel="noopener noreferrer" href='https://instagram.com/LucasCabral95' className="icono">
            <FaInstagramSquare className="icon" />
          </a>
        </div>
        <div className="info">
          <div className="texto">
            <p> Lucas Cabral Dev © 2024 </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default FooterInterior