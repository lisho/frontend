// src/services/api.js
import axios from 'axios';

// Lee la URL base de la API desde las variables de entorno de React
// Asegúrate de que la variable empiece con REACT_APP_
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

// Crea una instancia de Axios con la URL base
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- Funciones para Recetas ---

export const getAllRecipes = (params = {}) => {
  // params podría ser { categoryId: 1, search: 'tarta' }
  return apiClient.get('/recipes', { params });
};

export const getRecipeById = (id) => {
  return apiClient.get(`/recipes/${id}`);
};

export const createRecipe = (recipeData) => {
  // ¡Necesitará autenticación en el futuro!
  return apiClient.post('/recipes', recipeData);
};

export const updateRecipe = (id, recipeData) => {
  // ¡Necesitará autenticación en el futuro!
  return apiClient.put(`/recipes/${id}`, recipeData);
};

export const deleteRecipe = (id) => {
  // ¡Necesitará autenticación en el futuro!
  return apiClient.delete(`/recipes/${id}`);
};

// --- Funciones CRUD para Categorías ---
export const getAllCategories = () => {
  return apiClient.get('/categories');
};
export const createCategory = (categoryData) => {
  return apiClient.post('/categories', categoryData); // { name: "Nueva Cat" }
};
export const updateCategory = (id, categoryData) => {
  return apiClient.put(`/categories/${id}`, categoryData); // { name: "Nuevo Nombre" }
};
export const deleteCategory = (id) => {
  return apiClient.delete(`/categories/${id}`);
};

// --- Funciones CRUD para Unidades ---
export const getAllUnits = () => { // Nueva función para obtener todas las unidades
    return apiClient.get('/units');
};
export const createUnit = (unitData) => {
    return apiClient.post('/units', unitData); // { name: "Nueva Unidad" }
};
export const updateUnit = (id, unitData) => {
    return apiClient.put(`/units/${id}`, unitData); // { name: "Nuevo Nombre" }
};
export const deleteUnit = (id) => {
    return apiClient.delete(`/units/${id}`);
};

export const getUniqueIngredients = () => {
  return apiClient.get('/ingredients/unique');
};

// Exporta un objeto con todas las funciones o expórtalas individualmente
// export default {
//   getAllRecipes,
//   getRecipeById,
//   createRecipe,
//   updateRecipe,
//   deleteRecipe,
//   getAllCategories,
// }