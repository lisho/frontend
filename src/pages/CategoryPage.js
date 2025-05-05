// src/pages/CategoryPage.js
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getAllRecipes, getAllCategories } from '../services/api'; // Necesitamos ambas
import RecipeCard from '../components/recipe/RecipeCard'; // Ajusta la ruta
import Pagination from '../components/common/Pagination';
import '../pages/HomePage.css'; // Reutilizar estilos
import './CategoryPage.css'; // Estilos específicos si los hay

const RECIPES_PER_PAGE = 9;

function CategoryPage() {
    const { categoryId } = useParams();
    const [recipes, setRecipes] = useState([]);
    const [categoryName, setCategoryName] = useState('Cargando...'); // Estado inicial de carga
    const [isLoadingRecipes, setIsLoadingRecipes] = useState(true); // Carga de recetas
    const [isLoadingName, setIsLoadingName] = useState(true); // Carga del nombre
    const [error, setError] = useState(null);

    // Estados para paginación y ordenación
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [sortBy, setSortBy] = useState('createdAt');
    const [sortOrder, setSortOrder] = useState('DESC');

    // --- Efecto SEPARADO para obtener el NOMBRE de la categoría ---
    useEffect(() => {
        let isMounted = true; // Flag para desmontaje
        setIsLoadingName(true);
        setError(null); // Limpiar errores previos de nombre

        const fetchCategoryName = async () => {
            if (!categoryId) {
                if (isMounted) {
                    setError("ID de categoría no válido.");
                    setCategoryName("Error");
                    setIsLoadingName(false);
                }
                return;
            }
            try {
                // Intenta obtener el nombre directamente (si tienes API)
                // o de la lista completa
                const categoriesResponse = await getAllCategories();
                if (isMounted) {
                    const foundCategory = categoriesResponse.data.find(cat => cat.id === parseInt(categoryId, 10));
                    setCategoryName(foundCategory ? foundCategory.name : 'Categoría Desconocida');
                }
            } catch (catError) {
                console.error("Error fetching category name:", catError);
                if (isMounted) {
                    setError("Error al cargar nombre de categoría.");
                    setCategoryName('Error');
                }
            } finally {
                if (isMounted) {
                    setIsLoadingName(false);
                }
            }
        };

        fetchCategoryName();

        return () => { isMounted = false }; // Cleanup

    }, [categoryId]); // Depende SOLO de categoryId

    // --- useCallback para obtener las RECETAS ---
    //QUITAMOS categoryName de las dependencias
    const fetchRecipes = useCallback(async () => {
        if (!categoryId) return; // Salir si no hay ID

        setIsLoadingRecipes(true);
        // No resetear error aquí para no ocultar error de nombre
        // setError(null);
        setRecipes([]); // Limpiar recetas previas

        try {
            const params = {
                categoryId: categoryId,
                page: currentPage,
                limit: RECIPES_PER_PAGE,
                sortBy: sortBy,
                sortOrder: sortOrder,
            };
            const recipeResponse = await getAllRecipes(params);
            setRecipes(recipeResponse.data.recipes || []);
            setTotalPages(recipeResponse.data.pagination?.totalPages || 0);
             // Limpiar error si la carga de recetas fue exitosa
             setError(null);

        } catch (err) {
            console.error(`Error fetching recipes for category ${categoryId}:`, err);
            // Mostrar error específico de recetas
             if (err.message !== 'canceled') { // Evitar mostrar error si se canceló por desmontaje
                 setError('No se pudieron cargar las recetas para esta categoría.');
             }
            setRecipes([]);
            setTotalPages(0);
        } finally {
            // No setear isLoadingRecipes a false aquí si fetchCategoryName aún no termina?
            // Mejor separar estados de carga
            setIsLoadingRecipes(false);
        }
    // Dependencias SIN categoryName
    }, [categoryId, currentPage, sortBy, sortOrder]);

    // --- useEffect para LLAMAR a fetchRecipes ---
    useEffect(() => {
        // Solo llama a fetchRecipes si categoryId es válido
        if (categoryId) {
            fetchRecipes();
        }
    }, [fetchRecipes]); // Depende solo de la función memoizada

    // --- useEffect para Resetear Página ---
    useEffect(() => {
        // console.log("Resetting page due to filter/sort change");
        setCurrentPage(1);
    }, [categoryId, sortBy, sortOrder]);


    // Handlers (sin cambios)
    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };
    const handleSortChange = (e) => {
        const value = e.target.value;
        const [newSortBy, newSortOrder] = value.split(',');
        setSortBy(newSortBy);
        setSortOrder(newSortOrder);
    };

    // Determinar título y estado de carga general
    const isLoading = isLoadingRecipes || isLoadingName; // Carga general si alguna de las dos está activa
    let title = isLoadingName ? 'Cargando...' : (categoryName || 'Categoría');
    if (!isLoadingName && categoryName !== 'Error' && categoryName !== 'Categoría Desconocida') {
         title = `Recetas en: ${categoryName}`;
    } else if (error) {
         title = "Error al cargar";
    }


    return (
        <div>
            <h2 className="category-page-title">{title}</h2>

            {/* Mostrar error general */}
            {error && <p className="status-message error">{error}</p>}

            {/* Controles de Ordenación (solo si no hay error y no carga nombre) */}
             {!isLoadingName && !error && (
                 <div className="sorting-controls">
                     <label htmlFor="sort-select">Ordenar por: </label>
                     <select id="sort-select" value={`${sortBy},${sortOrder}`} onChange={handleSortChange} disabled={isLoadingRecipes}>
                         <option value="createdAt,DESC">Más Recientes</option>
                         <option value="createdAt,ASC">Más Antiguas</option>
                         <option value="title,ASC">Título (A-Z)</option>
                         <option value="title,DESC">Título (Z-A)</option>
                         <option value="averageRating,DESC">Mejor Valoradas</option>
                         <option value="averageRating,ASC">Peor Valoradas</option>
                     </select>
                 </div>
             )}


            {/* Mensajes de estado y grid */}
            {isLoadingRecipes && <p className="status-message">Cargando recetas...</p>}
            {!isLoadingRecipes && !error && recipes.length === 0 && (
                <p className="status-message">No se encontraron recetas en esta categoría.</p>
            )}

            {!isLoadingRecipes && recipes.length > 0 && (
                <div className="recipe-grid">
                    {recipes.map((recipe) => (
                        <RecipeCard key={recipe.id} recipe={recipe} />
                    ))}
                </div>
            )}

            {/* Paginación */}
            {!isLoading && totalPages > 0 && ( // Mostrar solo si no carga y hay páginas
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            )}

            <div style={{ textAlign: 'center', marginTop: '30px' }}>
                <Link to="/" className="button button-default">Volver a Inicio</Link>
            </div>
        </div>
    );
}

export default CategoryPage;