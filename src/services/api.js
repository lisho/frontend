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

// --- Funciones para Categorías ---

export const getAllCategories = () => {
  return apiClient.get('/categories');
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