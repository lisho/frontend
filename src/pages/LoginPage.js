// src/pages/LoginPage.js
import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom'; // Importa Link
import { useAuth } from '../context/AuthContext';
import AuthForm from '../components/auth/AuthForm';
import '../components/auth/Auth.css'; // <-- Importa los nuevos estilos

function LoginPage() {
    const [error, setError] = useState('');
    const { login, isLoading } = useAuth(); // Añadir isLoading
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';

    const handleLogin = async (credentials) => {
        setError('');
        try {
            await login(credentials);
            navigate(from, { replace: true });
        } catch (err) {
            const message = err.response?.data?.message || 'Error al iniciar sesión. Verifica tus credenciales.';
            setError(message);
        }
    };

    return (
        // Contenedor para centrar
        <div className="auth-page-container">
             {/* Tarjeta */}
            <div className="auth-card">
                <h2>Iniciar Sesión</h2>
                {error && <p className="error-message">{error}</p>}
                <AuthForm
                    onSubmit={handleLogin}
                    isRegister={false}
                    submitButtonText={isLoading ? "Entrando..." : "Entrar"} // Texto dinámico
                    // Pasar isLoading para deshabilitar botón si es necesario (AuthForm debe aceptarlo)
                    isLoading={isLoading}
                />
                {/* Enlace a Registro */}
                <p className="auth-link">
                    ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
                </p>
            </div>
        </div>
    );
}
export default LoginPage;