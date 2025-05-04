// src/components/recipe/RatingStars.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { rateRecipe } from '../../services/api';
import './RatingStars.css';
// import { FaStar } from 'react-icons/fa'; // Ejemplo icono

function RatingStars({ recipeId, averageRating = 0, ratingCount = 0, initialUserRating = 0 }) {
    const { isAuthenticated } = useAuth();
    const [userRating, setUserRating] = useState(initialUserRating); // Rating actual del usuario
    const [hoverRating, setHoverRating] = useState(0); // Rating mientras se hace hover
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [currentAverage, setCurrentAverage] = useState(averageRating); // Estado local para promedio
    const [currentCount, setCurrentCount] = useState(ratingCount);     // Estado local para contador

    // Sincronizar con props si cambian desde el padre
    useEffect(() => {
        setUserRating(initialUserRating);
    }, [initialUserRating]);

    useEffect(() => {
        setCurrentAverage(averageRating);
    }, [averageRating]);

     useEffect(() => {
        setCurrentCount(ratingCount);
    }, [ratingCount]);

    const handleMouseEnter = (index) => {
        if (!isAuthenticated || isLoading) return;
        setHoverRating(index + 1);
    };

    const handleMouseLeave = () => {
        if (!isAuthenticated || isLoading) return;
        setHoverRating(0); // Reset hover al salir
    };

    const handleClick = async (index) => {
        if (!isAuthenticated || isLoading) return;

        const newRating = index + 1;
        // Si vuelve a hacer clic en la misma estrella, ¿permitir quitar voto? Por ahora no.
        // if (newRating === userRating) return;

        setIsLoading(true);
        setError('');

        try {
            const response = await rateRecipe(recipeId, newRating);
            // Actualizar estado local con la respuesta de la API
            setUserRating(newRating); // El voto del usuario ahora es este
            setCurrentAverage(response.data.averageRating); // Actualizar promedio mostrado
            setCurrentCount(response.data.ratingCount);     // Actualizar contador mostrado
            // No necesitamos actualizar initialUserRating aquí, el padre lo haría si recarga datos.

        } catch (err) {
            console.error("Error al votar:", err);
            setError("Error al enviar voto.");
            setTimeout(() => setError(''), 3000);
        } finally {
            setIsLoading(false);
            setHoverRating(0); // Asegura que el hover se quite después del click
        }
    };

    const stars = [];
    for (let i = 0; i < 5; i++) {
        const starValue = i + 1;
        let starClass = "star-icon"; // Clase base

        // Determinar si la estrella está "llena"
        if (hoverRating >= starValue) { // Prioridad al hover
            starClass += " hover";
        } else if (userRating >= starValue) { // Si no hay hover, usar el voto guardado
            starClass += " selected";
        }

        stars.push(
            <span
                key={i}
                className={starClass}
                onMouseEnter={() => handleMouseEnter(i)}
                onMouseLeave={handleMouseLeave}
                onClick={() => handleClick(i)}
            >
                {/* ★ */} {/* Estrella Unicode Sólida */}
                ☆ {/* Estrella Unicode Vacía (se oculta/muestra con CSS) */}
            </span>
            // O usar icono: <FaStar key={i} className={starClass} ... handlers ... />
        );
    }
    console.log("RatingStars State:", { userRating, initialUserRating });
    return (
        <div className={`rating-stars-container ${!isAuthenticated ? 'disabled' : ''} ${isLoading ? 'loading' : ''}`}>
            <div className="stars" title={isAuthenticated ? `Tu voto: ${userRating > 0 ? userRating : 'ninguno'}. Haz clic para votar.` : "Inicia sesión para votar"}>
                {stars}
            </div>
            <div className="rating-info">
                 {currentAverage > 0 ? (
                     `Promedio: ${Number(currentAverage).toFixed(1)} (${currentCount} ${currentCount === 1 ? 'voto' : 'votos'})`
                 ) : (
                    ratingCount > 0 ? `Promedio: ${Number(averageRating).toFixed(1)} (${ratingCount} ${ratingCount === 1 ? 'voto' : 'votos'})` : // Mostrar props iniciales si el estado local es 0 pero había votos
                     'Aún sin votos'
                 )}
            </div>
             {error && <div className="rating-error">{error}</div>}
        </div>
    );
}

export default RatingStars;