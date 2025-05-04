// src/components/Navbar.js
import React, { useState, useEffect } from 'react'; // Añadir useState/useEffect para menú local
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Importar useAuth
import './Navbar.css';

function Navbar() {

  const { user, isAuthenticated, logout } = useAuth(); // Obtener estado de autenticación y logout
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Manejo local del menú
    const location = useLocation();

     // Cierra menú al navegar
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location]);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

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

            <ul className={`nav-links ${isMobileMenuOpen ? 'open' : ''}`}>
                <li><Link to="/">Inicio</Link></li>

                {/* Enlaces Condicionales */}
                {isAuthenticated ? (
                    <>
                        <li><Link to="/add-recipe">Añadir Receta</Link></li>
                        {/* Mostrar enlaces de Admin si el rol es 'admin' */}
                        {user?.role === 'admin' && (
                            <>
                                <li><Link to="/manage-data">Gestionar Datos</Link></li>
                                {/* <li><Link to="/admin/users">Gestionar Usuarios</Link></li> */}
                            </>
                        )}
                        <li><Link to="/profile">Mi Perfil ({user?.username})</Link></li>
                        <li>
                            <button onClick={logout} className="button button-default logout-button">
                                Salir
                            </button>
                        </li>
                    </>
                ) : (
                    <>
                        <li><Link to="/login">Entrar</Link></li>
                        <li><Link to="/register">Registrarse</Link></li>
                    </>
                )}
            </ul>
        </div>
    </nav>
  );
}

export default Navbar;