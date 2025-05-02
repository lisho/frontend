// src/components/RecipeForm.js
import React, { useState, useEffect } from 'react';
import { getAllCategories } from '../services/api'; // Necesitamos las categorías
import './RecipeForm.css'; // Crearemos este archivo para estilos

// Estado inicial para un ingrediente vacío
const emptyIngredient = { amount: '', unit: '', name: '' };

function RecipeForm({ initialData, onSubmit, isEditMode = false }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState([{ ...emptyIngredient }]);
  const [steps, setSteps] = useState(['']); // Empezar con un paso vacío
  const [preparationTime, setPreparationTime] = useState('');
  const [cookingTime, setCookingTime] = useState('');
  const [servings, setServings] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [error, setError] = useState(null); // Para errores de carga o envío

  // Cargar categorías al montar el componente
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const response = await getAllCategories();
        setCategories(response.data || []);
        setError(null);
        // Si no estamos editando y hay categorías, selecciona la primera por defecto
        if (!isEditMode && response.data?.length > 0) {
            setCategoryId(response.data[0].id);
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError('No se pudieron cargar las categorías. Inténtalo de nuevo.');
        setCategories([]);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, [isEditMode]); // Solo se ejecuta al montar o si cambia isEditMode

  // Rellenar el formulario si recibimos initialData (modo edición)
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setDescription(initialData.description || '');
      setIngredients(initialData.ingredients || [{ ...emptyIngredient }]);
      setSteps(initialData.steps || ['']);
      setPreparationTime(initialData.preparationTime || '');
      setCookingTime(initialData.cookingTime || '');
      setServings(initialData.servings || '');
      setCategoryId(initialData.categoryId || '');
      setImageUrl(initialData.imageUrl || '');
    }
  }, [initialData]); // Se ejecuta cuando initialData cambia

  // --- Manejadores de Ingredientes ---
  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index][field] = value;
    setIngredients(newIngredients);
  };

  const addIngredient = () => {
    setIngredients([...ingredients, { ...emptyIngredient }]);
  };

  const removeIngredient = (index) => {
    if (ingredients.length <= 1) return; // No eliminar el último
    const newIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(newIngredients);
  };

  // --- Manejadores de Pasos ---
  const handleStepChange = (index, value) => {
    const newSteps = [...steps];
    newSteps[index] = value;
    setSteps(newSteps);
  };

  const addStep = () => {
    setSteps([...steps, '']);
  };

  const removeStep = (index) => {
    if (steps.length <= 1) return; // No eliminar el último
    const newSteps = steps.filter((_, i) => i !== index);
    setSteps(newSteps);
  };

  // --- Manejador de Envío ---
  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null); // Limpiar errores previos

    // Validación básica (se puede mejorar)
    if (!title || !categoryId || ingredients.length === 0 || steps.length === 0) {
      setError('Por favor, completa los campos requeridos: Título, Categoría, al menos un Ingrediente y un Paso.');
      return;
    }
    // Validar que los ingredientes y pasos no estén vacíos (solo los nombres/descripción)
    if (ingredients.some(ing => !ing.name.trim()) || steps.some(step => !step.trim())) {
        setError('Asegúrate de que todos los ingredientes tengan nombre y todos los pasos tengan descripción.');
        return;
    }


    const recipeData = {
      title: title.trim(),
      description: description.trim(),
      // Filtra ingredientes que tengan al menos el nombre
      ingredients: ingredients.filter(ing => ing.name.trim()),
      // Filtra pasos que no estén vacíos
      steps: steps.filter(step => step.trim()),
      preparationTime: preparationTime ? parseInt(preparationTime, 10) : null,
      cookingTime: cookingTime ? parseInt(cookingTime, 10) : null,
      servings: servings ? parseInt(servings, 10) : null,
      categoryId: parseInt(categoryId, 10), // Asegurarse que es número
      imageUrl: imageUrl.trim() || null, // Si está vacío, mandar null
    };

    // Llama a la función onSubmit pasada desde el componente padre
    onSubmit(recipeData);
  };

  return (
    <form onSubmit={handleSubmit} className="recipe-form">
      <h2>{isEditMode ? 'Editar Receta' : 'Añadir Nueva Receta'}</h2>

      {error && <p className="form-error">{error}</p>}

      <div className="form-group">
        <label htmlFor="title">Título *</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Descripción Corta</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="3"
        />
      </div>

      <div className="form-group">
        <label htmlFor="category">Categoría *</label>
        {loadingCategories ? (
          <p>Cargando categorías...</p>
        ) : categories.length > 0 ? (
          <select
            id="category"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
          >
            <option value="" disabled>Selecciona una categoría</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        ) : (
             <p>No hay categorías disponibles. Añade alguna primero.</p>
        )}
      </div>

       {/* --- Sección Ingredientes --- */}
       <fieldset className="form-section">
          <legend>Ingredientes *</legend>
          {ingredients.map((ingredient, index) => (
              <div key={index} className="ingredient-item">
                  <input
                      type="text"
                      placeholder="Cantidad (ej: 100)"
                      value={ingredient.amount}
                      onChange={(e) => handleIngredientChange(index, 'amount', e.target.value)}
                      className="input-amount"
                  />
                  <input
                      type="text"
                      placeholder="Unidad (ej: gr, ml, taza)"
                      value={ingredient.unit}
                      onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}
                      className="input-unit"
                  />
                  <input
                      type="text"
                      placeholder="Nombre del Ingrediente *"
                      value={ingredient.name}
                      onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                      required // Solo el nombre es estrictamente requerido aquí
                      className="input-name"
                  />
                  <button
                      type="button"
                      onClick={() => removeIngredient(index)}
                      disabled={ingredients.length <= 1}
                      className="button-remove"
                  >
                      × {/* Símbolo de multiplicar como 'x' */}
                  </button>
              </div>
          ))}
          <button type="button" onClick={addIngredient} className="button-add">
              + Añadir Ingrediente
          </button>
      </fieldset>

      {/* --- Sección Pasos --- */}
       <fieldset className="form-section">
          <legend>Pasos *</legend>
          {steps.map((step, index) => (
              <div key={index} className="step-item">
                  <span className="step-number">{index + 1}.</span>
                  <textarea
                      placeholder="Describe este paso..."
                      value={step}
                      onChange={(e) => handleStepChange(index, e.target.value)}
                      required
                      rows="2"
                      className="input-step"
                  />
                  <button
                      type="button"
                      onClick={() => removeStep(index)}
                      disabled={steps.length <= 1}
                      className="button-remove"
                  >
                      ×
                  </button>
              </div>
          ))}
          <button type="button" onClick={addStep} className="button-add">
              + Añadir Paso
          </button>
      </fieldset>

      {/* --- Sección Detalles Opcionales --- */}
      <fieldset className="form-section">
        <legend>Detalles Adicionales</legend>
        <div className="form-row">
            <div className="form-group">
              <label htmlFor="preparationTime">Tiempo Prep. (min)</label>
              <input
                type="number"
                id="preparationTime"
                value={preparationTime}
                onChange={(e) => setPreparationTime(e.target.value)}
                min="0"
              />
            </div>
            <div className="form-group">
              <label htmlFor="cookingTime">Tiempo Cocción (min)</label>
              <input
                type="number"
                id="cookingTime"
                value={cookingTime}
                onChange={(e) => setCookingTime(e.target.value)}
                min="0"
              />
            </div>
            <div className="form-group">
              <label htmlFor="servings">Porciones</label>
              <input
                type="number"
                id="servings"
                value={servings}
                onChange={(e) => setServings(e.target.value)}
                min="1"
              />
            </div>
        </div>
         <div className="form-group">
            <label htmlFor="imageUrl">URL de la Imagen Principal</label>
            <input
              type="url"
              id="imageUrl"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://ejemplo.com/imagen.jpg"
            />
        </div>
      </fieldset>

      <button type="submit" className="button-submit">
        {isEditMode ? 'Guardar Cambios' : 'Crear Receta'}
      </button>
    </form>
  );
}

export default RecipeForm;