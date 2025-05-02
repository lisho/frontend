// src/components/RecipeCard.js
import React from 'react';
import { Link } from 'react-router-dom';
import './RecipeCard.css'; // Crearemos estilos para la tarjeta

// Una imagen placeholder por si la receta no tiene una
const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/300x200.png?text=Receta';

function RecipeCard({ recipe }) {
  // Asegúrate de que 'recipe' existe antes de intentar acceder a sus propiedades
  if (!recipe) {
    return null; // O renderizar un estado de carga/error si es necesario
  }

  // Prepara los datos a mostrar
  const imageUrl = recipe.imageUrl || PLACEHOLDER_IMAGE;
  const categoryName = recipe.category?.name || 'Sin categoría'; // Acceso seguro a category.name
  const recipeUrl = `/recipe/${recipe.id}`;

  return (
    <Link to={recipeUrl} className="recipe-card-link">
      <div className="recipe-card">
        <div className="recipe-card-image-container">
          <img
            src={imageUrl}
            alt={recipe.title || 'Imagen de receta'}
            className="recipe-card-image"
            onError={(e) => { // Manejo de error si la imagen no carga
                e.target.onerror = null; // Previene bucles si el placeholder falla
                e.target.src = PLACEHOLDER_IMAGE;
             }}
          />
          <span className="recipe-card-category">{categoryName}</span>
        </div>
        <div className="recipe-card-content">
          <h3 className="recipe-card-title">{recipe.title || 'Receta sin título'}</h3>
          {/* Podríamos añadir una descripción corta si la tuviéramos */}
          {/* <p className="recipe-card-description">{recipe.description?.substring(0, 80)}...</p> */}
          <div className="recipe-card-meta">
              {recipe.preparationTime && <span>Prep: {recipe.preparationTime} min</span>}
              {recipe.cookingTime && <span>Cocción: {recipe.cookingTime} min</span>}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default RecipeCard;