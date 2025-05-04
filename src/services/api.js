// src/services/api.js
import axios from 'axios';
import { getToken } from '../utils/localStorage'; // Asegúrate que la ruta sea correcta
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

// 2. APLICA el interceptor a ESA instancia ANTES de definir las funciones API
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken(); // Lee el token en cada petición
    // console.log("Interceptor: Token encontrado:", token ? 'Sí' : 'No'); // Log para depurar interceptor
    if (token) {
      // console.log("Interceptor: Añadiendo cabecera Auth");
      config.headers['Authorization'] = `Bearer ${token}`;
    } else {
         // Opcional: eliminarla si no hay token (por si acaso)
         delete config.headers['Authorization'];
    }
    return config; // Devuelve la config modificada (o no)
  },
  (error) => {
     console.error("Interceptor Error:", error);
    return Promise.reject(error);
  }
);

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

// --- Autenticación ---
export const login = (credentials) => apiClient.post('/auth/login', credentials);
export const register = (userData) => apiClient.post('/auth/register', userData);

// --- Perfil de Usuario ---
export const getMyProfile = () => apiClient.get('/users/me');
export const updateMyProfile = (userData) => apiClient.put('/users/me', userData);
export const getMyFavorites = () => apiClient.get('/users/me/favorites'); // Asegúrate que esta ruta exista o usa la otra

// --- Recetas (Interacciones) ---
// ... (getAllRecipes, getRecipeById, etc.) ...
export const toggleFavorite = (recipeId) => apiClient.post(`/recipes/${recipeId}/favorite`);
export const rateRecipe = (recipeId, score) => apiClient.post(`/recipes/${recipeId}/rate`, { score });

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