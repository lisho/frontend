// src/pages/HomePage.js
import React, { useState, useEffect, useCallback } from 'react';
import { getAllRecipes } from '../services/api';
import RecipeCard from '../components/recipe/RecipeCard'; // Importa la tarjeta
import Pagination from '../components/common/Pagination'; // Importar Paginación

import './HomePage.css'; // Creamos estilos para la cuadrícula

const RECIPES_PER_PAGE = 9; // O el límite que prefieras

function HomePage() {
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- NUEVOS ESTADOS PARA PAGINACION---
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  // const [totalItems, setTotalItems] = useState(0); // No lo usamos directamente por ahora
  const [sortBy, setSortBy] = useState('createdAt'); // Default: más recientes
  const [sortOrder, setSortOrder] = useState('DESC');

  const fetchRecipes = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Pasar parámetros a la API
      const params = {
          page: currentPage,
          limit: RECIPES_PER_PAGE,
          sortBy: sortBy,
          sortOrder: sortOrder,
          // Aquí podrías añadir otros filtros si la HomePage los tuviera (ej: search)
      };
      const response = await getAllRecipes(params);
      setRecipes(response.data.recipes || []);
      // Actualizar estado de paginación
      setTotalPages(response.data.pagination?.totalPages || 0);
      // setCurrentPage(response.data.pagination?.currentPage || 1); // No es necesario si ya lo controlamos
      // setTotalItems(response.data.pagination?.totalItems || 0);
      } catch (err) {
        console.error("Error fetching recipes:", err);
        setError('No se pudieron cargar las recetas. Inténtalo de nuevo más tarde.');
        setRecipes([]); // Limpia las recetas en caso de error
        setTotalPages(0); // Resetear paginación en error
      } finally {
        setIsLoading(false);
      }
    }, [currentPage, sortBy, sortOrder]);

    useEffect(() => {
      fetchRecipes();
    }, [fetchRecipes]); // Ejecutar al montar y cuando cambien las dependencias de fetchRecipes
  
    // Handlers para cambiar paginación y ordenación
    const handlePageChange = (newPage) => {
      setCurrentPage(newPage);
      // Opcional: Scroll to top al cambiar página
      // window.scrollTo(0, 0);
    };
  
    const handleSortChange = (e) => {
      const value = e.target.value;
      // Formato esperado: "campo,ORDEN" ej: "title,ASC"
      const [newSortBy, newSortOrder] = value.split(',');
      setSortBy(newSortBy);
      setSortOrder(newSortOrder);
      setCurrentPage(1); // Resetear a página 1 al cambiar orden
    };

  return (
    <div>
      <h2 className="home-title">Descubre Recetas Deliciosas</h2>
      {/* --- NUEVO: Controles de Ordenación --- */}
      <div className="sorting-controls">
          <label htmlFor="sort-select">Ordenar por: </label>
          <select id="sort-select" value={`${sortBy},${sortOrder}`} onChange={handleSortChange}>
              <option value="createdAt,DESC">Más Recientes</option>
              <option value="createdAt,ASC">Más Antiguas</option>
              <option value="title,ASC">Título (A-Z)</option>
              <option value="title,DESC">Título (Z-A)</option>
              <option value="averageRating,DESC">Mejor Valoradas</option>
              <option value="averageRating,ASC">Peor Valoradas</option>
              {/* Añade más opciones si quieres (ej: tiempo preparación) */}
          </select>
      </div>
       {/* --- FIN Controles Ordenación --- */}


      {/* Grid de Recetas (sin cambios visuales directos) */}
      {isLoading && <p className="status-message">Cargando recetas...</p>}
      {error && <p className="status-message error">{error}</p>}
      {!isLoading && !error && recipes.length === 0 && (
        <p className="status-message">No se encontraron recetas.</p>
      )}
      {!isLoading && recipes.length > 0 && (
        <div className="recipe-grid">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}

       {/* --- NUEVO: Paginación --- */}
       {!isLoading && totalPages > 0 && (
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
       )}
       {/* --- FIN Paginación --- */}

    </div>
  );
}

export default HomePage;