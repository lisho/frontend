// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // Crearemos estilos específicos o moveremos los relevantes de App.css

function Navbar({ isMobileMenuOpen, toggleMobileMenu }) {
  return (
    <nav className={`main-nav ${isMobileMenuOpen ? 'mobile-menu-active' : ''}`}>
      <div className="nav-container">
        <Link to="/" className="main-title">Mi Recetario</Link>

        <button
          className="mobile-menu-toggle"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
          aria-expanded={isMobileMenuOpen}
        >
          <span className="hamburger-icon"></span>
        </button>

        {/* Lista de enlaces */}
        <ul className={`nav-links ${isMobileMenuOpen ? 'open' : ''}`}>
          <li><Link to="/">Inicio</Link></li>
          <li><Link to="/add-recipe">Añadir Receta</Link></li>
          <li><Link to="/manage-data">Gestionar Datos</Link></li>
          {/* ... otros enlaces ... */}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;