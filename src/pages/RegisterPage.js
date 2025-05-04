// src/pages/RegisterPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthForm from '../components/auth/AuthForm'; // Reutiliza el formulario

function RegisterPage() {
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleRegister = async (userData) => {
        setError('');
        // Asegurarse de que las contraseñas coincidan (esto debería hacerse en AuthForm)
        if (userData.password !== userData.confirmPassword) {
             setError('Las contraseñas no coinciden.');
             return;
        }

        // Quitar confirmPassword antes de enviar a la API
        const { confirmPassword, ...apiUserData } = userData;

        try {
            await register(apiUserData);
            navigate('/'); // Redirige a la home después del registro exitoso
        } catch (err) {
            const message = err.response?.data?.message || 'Error al registrar. Inténtalo de nuevo.';
            setError(message);
        }
    };

    return (
        <div>
            <h2>Crear Cuenta</h2>
            {error && <p className="error-message">{error}</p>}
            {/* Pasamos isRegister={true} */}
            <AuthForm onSubmit={handleRegister} isRegister={true} submitButtonText="Registrarse" />
             {/* Podrías añadir un enlace a /login aquí */}
        </div>
    );
}
export default RegisterPage;