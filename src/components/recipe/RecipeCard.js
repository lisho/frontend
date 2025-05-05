// src/components/RecipeCard.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Importar useAuth
import FavoriteButton from './FavoriteButton'; // Importar componente
import RatingStarsDisplay from './RatingStarsDisplay'; // Nuevo componente solo para mostrar estrellas
import './RecipeCard.css'; // Crearemos estilos para la tarjeta

// Una imagen placeholder por si la receta no tiene una
const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/300x200.png?text=Receta';

function RecipeCard({ recipe }) {
  const { isAuthenticated } = useAuth(); // Saber si mostrar botón de favorito
  // Asegúrate de que 'recipe' existe antes de intentar acceder a sus propiedades
  if (!recipe) {
    return null; // O renderizar un estado de carga/error si es necesario
  }

  // Prepara los datos a mostrar
  const imageUrl = recipe.imageUrl || PLACEHOLDER_IMAGE;
  const categoryId = recipe.category?.id;
  const categoryName = recipe.category?.name || 'Sin categoría';
  const recipeUrl = `/recipe/${recipe.id}`;
  const categoryUrl = categoryId ? `/category/${categoryId}` : '#';
  const authorName = recipe.author?.username;

  const handleCategoryClick = (e) => {
    // Previene que el click "suba" al enlace padre de la tarjeta
    e.stopPropagation();
    // La navegación la manejará el componente Link automáticamente
    console.log(`Navegando a categoría: ${categoryId}`);
  };  


  return (
    
      <div className="recipe-card-wrapper">
        <div className="recipe-card">

          {/* Contenedor de Imagen Relativo */}
          <div className="recipe-card-image-container">
          <Link to={recipeUrl} className="recipe-card-image-link">

            <img
              src={imageUrl}
              alt={recipe.title || 'Imagen de receta'}
              className="recipe-card-image"
              onError={(e) => { // Manejo de error si la imagen no carga
                  e.target.onerror = null; // Previene bucles si el placeholder falla
                  e.target.src = PLACEHOLDER_IMAGE;
              }}
            />
          </Link>

            {/* Enlace de categoría (no anidado incorrectamente) */}
           {categoryId ? (
                        <Link
                            to={categoryUrl}
                            className="recipe-card-category" // Necesita position: absolute en CSS
                            onClick={handleCategoryClick}
                        >
                            {categoryName}
                        </Link>
              ) : ( 
                <span className="recipe-card-category no-link">{categoryName}</span> 
              )}      
            </div>

          <div className="recipe-card-content">

             {/* Título como enlace */}
             <h3 className="recipe-card-title">
                <Link to={recipeUrl}>{recipe.title || 'Receta sin título'}</Link>
              </h3>
                     {/* Autor con icono */}
                     <div className="recipe-card-meta">
                        {/* Icono opcional para autor */}
                        {authorName && (
                            <span className="recipe-author-meta" title={`Autor: ${authorName}`}>
                                {/* <FaUserEdit /> O algún icono */}
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" fill="currentColor" style={{ verticalAlign: 'middle', /*marginRight: '5px'*/ }}><path d="M10.561 8.073a6.005 6.005 0 0 1 3.432 5.142.75.75 0 1 1-1.498.07 4.5 4.5 0 0 0-8.99-.334.75.75 0 0 1-1.5-.071 6.005 6.005 0 0 1 3.431-5.142 3.994 3.994 0 1 1 5.123 0ZM10.5 5a2.5 2.5 0 1 0-5 0 2.5 2.5 0 0 0 5 0Z"></path></svg>
                    Autor: <strong>{authorName}</strong>
                                
                            </span>
                        )}
                        
                    </div>

                    <div className="recipe-card-meta">
                        {recipe.preparationTime && <span>Prep: {recipe.preparationTime} min</span>}
                        {recipe.cookingTime && <span>Cocción: {recipe.cookingTime} min</span>}
                    </div>

                    {/* NUEVO: Contenedor para Rating y Favorito */}
                    <div className="recipe-card-interactions">
                        {/* Mostrar Rating Promedio */}
                         <RatingStarsDisplay
                            averageRating={recipe.averageRating || 0}
                            ratingCount={recipe.ratingCount || 0}
                         />

                        {/* Mostrar Botón Favorito (solo si logueado) */}
                        {isAuthenticated && (
                            <FavoriteButton
                                recipeId={recipe.id}
                                initialIsFavorited={recipe.isFavorited || false}
                            />
                        )}
                    </div>
          </div>
        </div>
      </div>
    
  );
}

export default RecipeCard;