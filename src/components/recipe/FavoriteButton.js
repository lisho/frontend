// src/components/recipe/FavoriteButton.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { toggleFavorite } from '../../services/api'; // API service
import './FavoriteButton.css'; // Estilos específicos

// Podrías usar un icono de una librería como react-icons
// import { FaHeart, FaRegHeart } from 'react-icons/fa';

function FavoriteButton({ recipeId, initialIsFavorited }) {
    const { isAuthenticated, user } = useAuth(); // Necesitamos saber si está logueado
    const [isFavorited, setIsFavorited] = useState(initialIsFavorited);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Sincronizar estado si la prop inicial cambia (ej: si el padre recarga datos)
    useEffect(() => {
        setIsFavorited(initialIsFavorited);
    }, [initialIsFavorited]);

    const handleToggle = async () => {
        if (!isAuthenticated || isLoading) {
             // Podrías mostrar un mensaje o redirigir a login si no está autenticado
             console.log("Necesitas iniciar sesión para añadir a favoritos.");
            return;
        }

        setIsLoading(true);
        setError('');
        // Optimistic UI update (opcional): cambia el estado visual inmediatamente
        // setIsFavorited(!isFavorited);

        try {
            const response = await toggleFavorite(recipeId);
            // Actualiza el estado basado en la respuesta real de la API
            setIsFavorited(response.data.isFavorited);
        } catch (err) {
            console.error("Error al cambiar favorito:", err);
            setError('No se pudo actualizar el favorito.');
            // Revertir si se hizo UI optimista y falló la API
            // setIsFavorited(isFavorited); // Revierte al estado original
            // Pequeño timeout para que el usuario vea el error
            setTimeout(() => setError(''), 3000);
        } finally {
            setIsLoading(false);
        }
    };

    // No renderizar nada si el usuario es el autor? (Opcional)
    // if (user && user.id === recipeAuthorId) return null; // Necesitarías pasar recipeAuthorId

    // Decide qué icono/texto mostrar
    // const Icon = isFavorited ? FaHeart : FaRegHeart; // Ejemplo con react-icons
    const buttonText = isFavorited ? '♥ Quitar Favorito' : '♡ Añadir Favorito'; // Ejemplo con texto/emoji
    const buttonClass = `favorite-button ${isFavorited ? 'favorited' : ''} ${isLoading ? 'loading' : ''}`;

    return (
        <button
            className={buttonClass}
            onClick={handleToggle}
            disabled={!isAuthenticated || isLoading} // Deshabilitado si no logueado o cargando
            title={!isAuthenticated ? "Inicia sesión para añadir a favoritos" : (isFavorited ? "Quitar de favoritos" : "Añadir a favoritos")}
        >
            {/* <Icon className="favorite-icon" /> */}
            <span className="favorite-text">{isLoading ? '...' : buttonText}</span>
            {error && <span className="favorite-error">{error}</span>}
        </button>
    );
}

export default FavoriteButton;