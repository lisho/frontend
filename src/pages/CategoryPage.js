// src/pages/CategoryPage.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getAllRecipes } from '../services/api'; // Solo necesitamos esta
import RecipeCard from '../components/recipe/RecipeCard';
import '../pages/HomePage.css'; // Reutilizar estilos de grid
import './CategoryPage.css'; // Estilos específicos para esta página

function CategoryPage() {
  const { categoryId } = useParams(); // Obtiene el ID de la URL
  const [recipes, setRecipes] = useState([]);
  const [categoryName, setCategoryName] = useState(''); // Para mostrar el nombre
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipesByCategory = async () => {
      if (!categoryId) return; // No hacer nada si no hay ID

      setIsLoading(true);
      setError(null);
      setCategoryName(''); // Resetear nombre mientras carga
      setRecipes([]); // Limpiar recetas previas

      try {
        const response = await getAllRecipes({ categoryId: categoryId }); // Llama con el filtro
        const fetchedRecipes = response.data || [];
        setRecipes(fetchedRecipes);

        // Intenta obtener el nombre de la categoría desde la primera receta
        if (fetchedRecipes.length > 0 && fetchedRecipes[0].category) {
          setCategoryName(fetchedRecipes[0].category.name);
        } else {
          // Si no hay recetas o no tienen categoría, podríamos hacer
          // una llamada extra para obtener el nombre, o mostrar un default.
          // Por ahora, mostraremos un texto genérico si no hay recetas.
          // Si la categoría existe pero está vacía, categoryName quedará vacío.
           setCategoryName(''); // Nombre vacío si no hay recetas
        }

      } catch (err) {
        console.error(`Error fetching recipes for category ${categoryId}:`, err);
        setError('No se pudieron cargar las recetas para esta categoría.');
        setRecipes([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipesByCategory();
  }, [categoryId]); // Se ejecuta cada vez que el categoryId en la URL cambie

  // Determinar el título a mostrar
   let title = "Recetas";
   if (isLoading) {
       title = "Cargando recetas...";
   } else if (categoryName) {
       title = `Recetas en: ${categoryName}`;
   } else if (recipes.length === 0 && !error) {
       // Si categoryName está vacío pero SÍ cargó (no hay error) y no hay recetas,
       // la categoría probablemente existe pero está vacía.
       title = `No hay recetas en esta categoría`;
   } else if (!categoryName && !error) {
       // Caso raro: ID inválido que no dio error 404 pero no devolvió recetas con categoría?
       title = `Recetas para Categoría ID: ${categoryId}`;
   }


  return (
    <div>
      {/* Mostrar título dinámico */}
      <h2 className="category-page-title">{title}</h2>

      {error && <p className="status-message error">{error}</p>}

      {!isLoading && !error && recipes.length === 0 && (
        // Mensaje específico si la carga fue exitosa pero no hay recetas
        <p className="status-message">No se encontraron recetas en esta categoría.</p>
      )}

      {!isLoading && recipes.length > 0 && (
        // Reutilizar la cuadrícula de la HomePage
        <div className="recipe-grid">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  );
}

export default CategoryPage;