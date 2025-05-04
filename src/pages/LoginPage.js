// src/pages/LoginPage.js
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthForm from '../components/auth/AuthForm'; // Asume que este componente existe

function LoginPage() {
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/'; // A dónde redirigir después del login

    const handleLogin = async (credentials) => {
        setError(''); // Limpiar error previo
        try {
            await login(credentials);
            // console.log("Login exitoso, redirigiendo a:", from);
            navigate(from, { replace: true }); // Redirige a la página original o a la home
        } catch (err) {
            const message = err.response?.data?.message || 'Error al iniciar sesión. Verifica tus credenciales.';
            setError(message);
        }
    };

    return (
        <div>
            <h2>Iniciar Sesión</h2>
            {error && <p className="error-message">{error}</p>}
            {/* Pasamos isRegister={false} para que el form sepa qué hacer */}
            <AuthForm onSubmit={handleLogin} isRegister={false} submitButtonText="Entrar" />
            {/* Podrías añadir un enlace a /register aquí */}
        </div>
    );
}
export default LoginPage;