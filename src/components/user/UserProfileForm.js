// src/components/user/UserProfileForm.js
import React, { useState, useEffect } from 'react';

function UserProfileForm({ initialData, onSubmit }) {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (initialData) {
            setUsername(initialData.username || '');
            setEmail(initialData.email || '');
        }
    }, [initialData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setError(''); // Limpiar error
        // Validar contraseña nueva si se ingresó
        if (newPassword && newPassword !== confirmNewPassword) {
            setError('Las nuevas contraseñas no coinciden.');
            return;
        }
         if (newPassword && !currentPassword) {
             setError('Ingresa tu contraseña actual para establecer una nueva.');
             return;
        }

        const formData = { username, email };
        // Incluir contraseñas solo si se intenta cambiar
        if (currentPassword && newPassword) {
            formData.currentPassword = currentPassword;
            formData.newPassword = newPassword;
        }

        onSubmit(formData);
        // Limpiar campos de contraseña después de enviar (opcional)
         setCurrentPassword('');
         setNewPassword('');
         setConfirmNewPassword('');
    };

    return (
        <form onSubmit={handleSubmit} className="profile-form"> {/* Añadir clase */}
            {error && <p className="error-message">{error}</p>}
             <div className="form-group">
                <label htmlFor="profile-username">Nombre de Usuario</label>
                <input type="text" id="profile-username" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </div>
             <div className="form-group">
                <label htmlFor="profile-email">Email</label>
                <input type="email" id="profile-email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <hr/>
            <p><em>Para cambiar la contraseña, completa los siguientes campos:</em></p>
             <div className="form-group">
                <label htmlFor="currentPassword">Contraseña Actual</label>
                <input type="password" id="currentPassword" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
            </div>
             <div className="form-group">
                <label htmlFor="newPassword">Nueva Contraseña</label>
                <input type="password" id="newPassword" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} minLength={newPassword ? "6" : undefined}/>
            </div>
            <div className="form-group">
                <label htmlFor="confirmNewPassword">Confirmar Nueva Contraseña</label>
                <input type="password" id="confirmNewPassword" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} />
            </div>
            <button type="submit" className="button button-primary">Guardar Cambios</button>
        </form>
    );
}

export default UserProfileForm;