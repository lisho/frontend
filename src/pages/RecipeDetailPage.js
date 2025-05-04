// src/pages/RecipeDetailPage.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom'; // Añadir Link
import { useAuth } from '../context/AuthContext'; // Importar useAuth
import { getRecipeById, deleteRecipe } from '../services/api';
import FavoriteButton from '../components/recipe/FavoriteButton'; // Importar
import RatingStars from '../components/recipe/RatingStars'; // Importar
import './RecipeDetailPage.css'; // Importar estilos CSS

function RecipeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth(); // Obtener estado y usuario
  const [recipe, setRecipe] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await getRecipeById(id);
        setRecipe(response.data);
      } catch (err) {
        console.error("Error fetching recipe details:", err);
        setError('No se pudo cargar la receta.');
        if (err.response && err.response.status === 404) {
            setError('Receta no encontrada.');
        }
        setRecipe(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRecipe();
  }, [id]); // Se ejecuta cuando cambia el ID

  const handleDelete = async () => {
    // Confirmación antes de borrar
    if (window.confirm(`¿Estás seguro de que quieres eliminar la receta "${recipe?.title}"?`)) {
      setIsLoading(true); // Podríamos tener un estado de 'isDeleting'
      setError(null);
      try {
        await deleteRecipe(id);
        console.log("Receta eliminada con éxito");
        // Redirigir a la página de inicio después de borrar
        navigate('/');
      } catch (err) {
        console.error("Error deleting recipe:", err);
        setError('No se pudo eliminar la receta. Inténtalo de nuevo.');
        setIsLoading(false); // Solo si falla la eliminación
      }
    }
  };

  if (isLoading) {
    return <p>Cargando detalles de la receta...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  if (!recipe) {
    // Esto no debería pasar si el manejo de errores está bien, pero por si acaso
    return <p>Receta no encontrada.</p>;
  }

  // Formatear ingredientes y pasos para mostrarlos
  const renderIngredients = () => (
    <ul>
      {recipe.ingredients.map((ing, index) => (
        <li key={index}>
          {ing.amount && `${ing.amount} `}
          {ing.unit && `${ing.unit} `}
          {ing.name}
        </li>
      ))}
    </ul>
  );

  const renderSteps = () => (
    <ol>
      {recipe.steps.map((step, index) => (
        <li key={index}>{step}</li>
      ))}
    </ol>
  );

  // Preparar datos de categoría para el enlace
  const categoryId = recipe.category?.id;
  const categoryName = recipe.category?.name || 'Sin especificar';
  const categoryUrl = categoryId ? `/category/${categoryId}` : '#';

  return (
    <div className="recipe-detail">
      {/* Botones de Acción */}
      <div className="recipe-actions main-actions">
          {/* Mostrar Editar/Borrar si es admin o autor (ejemplo) */}
          {(user?.role === 'admin' /* || isAuthor */) && (
                <>
                  <Link to={`/edit-recipe/${recipe.id}`} className="button button-secondary">Editar</Link>
                  <button onClick={handleDelete} className="button button-danger">Eliminar</button>
                </>
          )}

           {/* Botón Favorito (siempre visible si logueado, excepto si es autor?) */}
           {isAuthenticated /* && !isAuthor */ && (
                <FavoriteButton
                    recipeId={recipe.id}
                    initialIsFavorited={recipe.isFavorited || false}
                />
            )}
      </div>

      <h2 className="recipe-title">{recipe.title}</h2>

    {/* --- ENLACE DE CATEGORÍA --- */}
    {categoryId ? (
              <Link to={categoryUrl} className="recipe-category-name">{categoryName}</Link>
        ) : (
              <span className="recipe-category-name no-link">{categoryName}</span>
        )}
        {/* --- FIN ENLACE CATEGORÍA --- */}

    {/* --- NUEVO: SECCIÓN DE VALORACIÓN --- */}
    <div className="recipe-rating-section">
    {console.log("Pasando a RatingStars:", { initialUserRating : recipe.userRating || 0, averageRating: recipe.averageRating || 0 })}
       
        <RatingStars
            recipeId={recipe.id}
            averageRating={recipe.averageRating || 0}
            ratingCount={recipe.ratingCount || 0}
            initialUserRating={recipe.userRating || 0}
        />
    </div>
    {/* --- FIN SECCIÓN VALORACIÓN --- */}

      {recipe.imageUrl && (
        <img src={recipe.imageUrl} alt={recipe.title} className="recipe-image" />
      )}

      {recipe.description && (
        <p className="recipe-description">{recipe.description}</p>
      )}

      <div className="recipe-meta">
          {recipe.category && <span>Categoría: {recipe.category.name}</span>}
          {recipe.preparationTime && <span>Prep: {recipe.preparationTime} min</span>}
          {recipe.cookingTime && <span>Cocción: {recipe.cookingTime} min</span>}
          {recipe.servings && <span>Porciones: {recipe.servings}</span>}
          {recipe.authorUsername && <span>Autor: {recipe.authorUsername}</span>}
      </div>

      <div className="recipe-content">
          <div className="recipe-ingredients">
              <h3>Ingredientes</h3>
              {renderIngredients()}
          </div>
          <div className="recipe-steps">
              <h3>Pasos</h3>
              {renderSteps()}
          </div>
      </div>

    </div>
  );
}

export default RecipeDetailPage;