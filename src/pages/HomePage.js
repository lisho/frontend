// src/pages/HomePage.js
import React, { useState, useEffect } from 'react';
import { getAllRecipes } from '../services/api';
import RecipeCard from '../components/RecipeCard'; // Importa la tarjeta
import './HomePage.css'; // Creamos estilos para la cuadrícula

function HomePage() {
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Carga las recetas cuando el componente se monta
  useEffect(() => {
    const fetchRecipes = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await getAllRecipes();
        setRecipes(response.data || []); // Asegúrate de que response.data es un array
      } catch (err) {
        console.error("Error fetching recipes:", err);
        setError('No se pudieron cargar las recetas. Inténtalo de nuevo más tarde.');
        setRecipes([]); // Limpia las recetas en caso de error
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipes();
  }, []); // El array vacío asegura que se ejecute solo una vez al montar

  // Renderizado condicional
  if (isLoading) {
    return <p className="status-message">Cargando recetas...</p>;
  }

  if (error) {
    return <p className="status-message error">{error}</p>;
  }

  return (
    <div>
      <h2 className="home-title">Descubre Recetas Deliciosas</h2>
      {recipes.length === 0 ? (
        <p className="status-message">No hay recetas todavía. ¡Añade la primera!</p>
      ) : (
        <div className="recipe-grid">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  );
}

export default HomePage;