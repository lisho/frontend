// src/components/auth/AuthForm.js
import React, { useState } from 'react';
// import './AuthForm.css'; // Si creas estilos específicos

function AuthForm({ onSubmit, isRegister = false, submitButtonText = 'Enviar', isLoading }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState(''); // Solo para registro
    const [confirmPassword, setConfirmPassword] = useState(''); // Solo para registro

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = { email, password };
        if (isRegister) {
            formData.username = username;
            formData.confirmPassword = confirmPassword; // Pasa confirmación para validación en la página
        }
        if (isLoading) return;
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="auth-form"> {/* Añadir clase para estilos */}
            {isRegister && (
                <div className="form-group">
                    <label htmlFor="username">Nombre de Usuario *</label>
                    <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                </div>
            )}
            <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="form-group">
                <label htmlFor="password">Contraseña *</label>
                <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength="6" />
            </div>
            {isRegister && (
                <div className="form-group">
                    <label htmlFor="confirmPassword">Confirmar Contraseña *</label>
                    <input type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                </div>
            )}
              <button
                type="submit"
                className="button button-primary auth-submit"
                disabled={isLoading} // <-- Deshabilitar si isLoading es true
             >
                 {/* El texto ya se pasa como prop desde la página */}
                 {submitButtonText}
             </button>
        </form>
    );
}

export default AuthForm;