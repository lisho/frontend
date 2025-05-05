// src/pages/RegisterPage.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Importa Link
import { useAuth } from '../context/AuthContext';
import AuthForm from '../components/auth/AuthForm';
import '../components/auth/Auth.css'; // <-- Importa los nuevos estilos

function RegisterPage() {
    const [error, setError] = useState('');
    const { register, isLoading } = useAuth(); // Añadir isLoading
    const navigate = useNavigate();

    const handleRegister = async (userData) => {
        setError('');
        if (userData.password !== userData.confirmPassword) {
             setError('Las contraseñas no coinciden.');
             return;
        }
        const { confirmPassword, ...apiUserData } = userData;

        try {
            await register(apiUserData);
            navigate('/');
        } catch (err) {
            const message = err.response?.data?.message || 'Error al registrar. Inténtalo de nuevo.';
            setError(message);
        }
    };

    return (
         // Contenedor para centrar
        <div className="auth-page-container">
            {/* Tarjeta */}
            <div className="auth-card">
                <h2>Crear Cuenta</h2>
                {error && <p className="error-message">{error}</p>}
                <AuthForm
                    onSubmit={handleRegister}
                    isRegister={true}
                    submitButtonText={isLoading ? "Registrando..." : "Registrarse"} // Texto dinámico
                    isLoading={isLoading} // Pasar isLoading
                 />
                 {/* Enlace a Login */}
                 <p className="auth-link">
                     ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
                 </p>
            </div>
        </div>
    );
}
export default RegisterPage;