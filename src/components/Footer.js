// src/components/Footer.js
import React from 'react';
import './Footer.css'; // Estilos específicos o mover de App.css

function Footer() {
  return (
    <footer className="main-footer">
      <p>© {new Date().getFullYear()} Mi Recetario</p>
    </footer>
  );
}

export default Footer;