// src/components/common/ScrollToTop.js
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop() {
  const { pathname } = useLocation(); // Obtiene la parte de la ruta de la ubicación actual

  useEffect(() => {
    // Haz scroll hacia arriba (coordenadas 0, 0)
    window.scrollTo(0, 0);
    // Alternativa con comportamiento suave (puede ser menos instantáneo):
    // window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, [pathname]); // El efecto se ejecuta CADA VEZ que cambia el 'pathname'

  return null; // Este componente no renderiza nada en el DOM
}

export default ScrollToTop;