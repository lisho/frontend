// src/components/RecipeForm.js
import React, { useState, useEffect, useRef } from 'react';
import { getAllCategories, getUniqueIngredients, getAllUnits } from '../../services/api'; // Necesitamos las categorías
import './RecipeForm.css'; // Crearemos este archivo para estilos

// Estado inicial para un ingrediente vacío
const emptyIngredient = { amount: '', unit: '', name: '' };


function RecipeForm({ initialData, onSubmit, isEditMode = false, isSubmitting, isLoadingData }) {
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
  const [isLoading, setIsLoading] = useState(false); // Estado para indicar si está cargando

  // --- Nuevos Estados para Sugerencias ---
  const [allIngredientNames, setAllIngredientNames] = useState([]); // Lista completa
  const [suggestions, setSuggestions] = useState([]); // Sugerencias filtradas
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0); // Para teclado
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [focusedIngredientIndex, setFocusedIngredientIndex] = useState(-1); // Qué input de ingrediente tiene foco

  const [units, setUnits] = useState([]); // Estado para unidades de medida
  const [loadingFormData, setLoadingFormData] = useState(true);
  // Refs para manejar clics fuera
  const suggestionsRef = useRef();


     // Cargar categorías, ingredientes únicos Y unidades
     useEffect(() => {
      let isMounted = true;
      const fetchData = async () => {
          setLoadingFormData(true); // Inicia carga
          setError(null);
          try {
              const [catResponse, ingResponse, unitResponse] = await Promise.all([
                  getAllCategories(),
                  getUniqueIngredients(),
                  getAllUnits() // <-- Llamada API para unidades
              ]);

              if (isMounted) {
                  setCategories(catResponse.data || []);
                  setAllIngredientNames(ingResponse.data || []);
                  setUnits(unitResponse.data || []); // <-- Guarda unidades en estado

                  // Lógica para seleccionar primera categoría (sin cambios)
                  if (!isEditMode && catResponse.data?.length > 0) {
                     // setCategoryId(catResponse.data[0].id); // ¿Resetear o mantener?
                  }
                  // Lógica para rellenar con initialData (si se hace aquí)
                  if (isEditMode && initialData) {
                       // ... setear title, desc, etc ...
                       setCategoryId(initialData.categoryId || ''); // Asegurar que setea categoría
                       // ... setear ingredientes, pasos, etc ...
                  } else if (!isEditMode) {
                       // ... resetear campos si es necesario ...
                       // ¿Resetear categoryId aquí o dejar la primera?
                       setCategoryId(''); // Resetearla aquí parece más consistente
                  }

              }
          } catch (err) {
              console.error("Error fetching form data:", err);
              if (isMounted) {
                  setError('No se pudieron cargar datos necesarios. Inténtalo de nuevo.');
                  setCategories([]);
                  setAllIngredientNames([]);
                  setUnits([]); // Limpiar unidades también
              }
          } finally {
              if (isMounted) setLoadingFormData(false); // Finaliza carga
          }
      };

      fetchData();
      return () => { isMounted = false; };
  // Dependencias: isEditMode para lógica de selección/reseteo.
  // initialData para rellenar datos (si se hace aquí, aunque es mejor separado).
  // Si la lógica de initialData está separada, la dependencia aquí sería solo [isEditMode]
  }, [isEditMode, initialData]); // REVISAR DEPENDENCIAS si separas useEffect de initialData


    // useEffect separado para initialData (RECOMENDADO)
    useEffect(() => {
      if (initialData) {
          setTitle(initialData.title || '');
          setDescription(initialData.description || '');
          setPreparationTime(initialData.preparationTime || '');
          setCookingTime(initialData.cookingTime || '');
          setServings(initialData.servings || '');
          setCategoryId(initialData.categoryId || '');
          setImageUrl(initialData.imageUrl || '');
           // La parte de ingredientes (esta debería estar funcionando según dices)
          setIngredients(initialData.ingredients?.map(ing => ({
              amount: ing.amount || '',
              unit: ing.unit || '',
              name: ing.name || ''
          })) || [{ ...emptyIngredient }]);
          setSteps(initialData.steps || ['']);
      } else if (!isEditMode) { // Solo resetea si initialData es null Y NO estamos editando
          setTitle('');
          // ... resetear otros campos ...
          setCategoryId(''); // Resetear categoría
          setIngredients([{ ...emptyIngredient }]);
          setSteps(['']);
          setError(null);
      }
  }, [initialData, isEditMode]); // isEditMode aquí asegura reseteo al pasar de Edit a Add

  // --- Click Listener para cerrar sugerencias ---
  useEffect(() => {
      const handleClickOutside = (event) => {
          if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
              setShowSuggestions(false);
          }
      };
      // Añadir listener si las sugerencias están visibles
      if (showSuggestions) {
          document.addEventListener('mousedown', handleClickOutside);
      } else {
          document.removeEventListener('mousedown', handleClickOutside);
      }
      // Cleanup listener
      return () => {
          document.removeEventListener('mousedown', handleClickOutside);
      };
  }, [showSuggestions]); // Solo se ejecuta cuando showSuggestions cambia


  // --- Manejadores de Ingredientes (ACTUALIZADO) ---
  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index][field] = value;
    setIngredients(newIngredients);

    // Lógica de sugerencias SOLO para el campo 'name'
    if (field === 'name') {
      if (value.trim().length > 0) {
        const filteredSuggestions = allIngredientNames.filter(
          name => name.toLowerCase().includes(value.toLowerCase())
        );
        setSuggestions(filteredSuggestions);
        // Muestra sugerencias solo si hay coincidencias y el input actual tiene foco
        setShowSuggestions(filteredSuggestions.length > 0 && index === focusedIngredientIndex);
        setActiveSuggestionIndex(0); // Resetea índice activo
      } else {
        setSuggestions([]); // Limpia sugerencias si el input está vacío
        setShowSuggestions(false);
      }
    }
  };


  const addIngredient = () => {
    setIngredients([...ingredients, { ...emptyIngredient }]);
  };

  const removeIngredient = (index) => {
    if (ingredients.length <= 1) return; // No eliminar el último
    const newIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(newIngredients);
  };

 // --- Manejadores de foco y selección de sugerencias ---
 const handleIngredientFocus = (index) => {
  setFocusedIngredientIndex(index);
  // Podríamos re-mostrar sugerencias si el campo ya tiene texto
   const currentValue = ingredients[index]?.name || '';
   if (currentValue.trim().length > 0 && suggestions.length > 0) {
       setShowSuggestions(true);
   }
};

const handleIngredientBlur = () => {
  // NO ocultar inmediatamente, esperar a ver si se hizo clic en sugerencia
  // Lo manejaremos con el listener de click outside
  // setFocusedIngredientIndex(-1);
   // setTimeout(() => setShowSuggestions(false), 150); // Alternativa si listener falla
};

const handleSuggestionClick = (suggestion) => {
  if (focusedIngredientIndex === -1) return; // Seguridad

  const newIngredients = [...ingredients];
  newIngredients[focusedIngredientIndex].name = suggestion;
  setIngredients(newIngredients);

  // Limpia y oculta sugerencias
  setSuggestions([]);
  setShowSuggestions(false);
  setFocusedIngredientIndex(-1); // Quita el foco trackeado
};

// --- Manejo de teclado para sugerencias ---
const handleKeyDown = (e) => {
  // Solo actuar si las sugerencias están visibles
  if (!showSuggestions || suggestions.length === 0) return;

  switch (e.key) {
      case 'Enter':
          e.preventDefault(); // Evita submit del form
          if (suggestions[activeSuggestionIndex]) {
              handleSuggestionClick(suggestions[activeSuggestionIndex]);
          }
          break;
      case 'ArrowUp':
          e.preventDefault();
          setActiveSuggestionIndex(prev => (prev > 0 ? prev - 1 : suggestions.length - 1));
          break;
      case 'ArrowDown':
          e.preventDefault();
          setActiveSuggestionIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : 0));
          break;
      case 'Escape':
          setShowSuggestions(false);
          break;
      default:
          break;
  }
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
    setError(null); // Limpiar errores previos
    setIsLoading(true); // Indicar que el envío está en progreso
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
    onSubmit(recipeData);
    setIsLoading(false); // Restablecer el estado de carga después del envío
    // Llama a la función onSubmit pasada desde el componente padre
    onSubmit(recipeData);
  };

  return (
    <form onSubmit={handleSubmit} className="recipe-form" autoComplete="off">
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
          {loadingFormData ? ( // Usar nuevo estado de carga
            <p>Cargando categorías...</p>
          ) : categories.length > 0 ? (
              <select id="category" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required>
                  <option value="" disabled>Selecciona una categoría</option>
                  {categories.map((cat) => ( <option key={cat.id} value={cat.id}>{cat.name}</option> ))}
              </select>
          ) : ( <p>No hay categorías disponibles.</p> )}
      </div>

       {/* --- Sección Ingredientes (ACTUALIZADA) --- */}
       <fieldset className="form-section">
        <legend>Ingredientes *</legend>
        {ingredients.map((ingredient, index) => (
          <div key={index} className="ingredient-item">
            {/* Campo Cantidad (igual) */}
            <input
              type="text"
              placeholder="Cantidad"
              value={ingredient.amount}
              onChange={(e) => handleIngredientChange(index, 'amount', e.target.value)}
              className="input-amount"
            />
            {/* Campo Unidad (NUEVO: Desplegable) */}
            <select
                value={ingredient.unit} // El valor sigue siendo el nombre de la unidad
                onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}
                className="input-unit"
                disabled={loadingFormData} // Deshabilitar mientras carga
            >
                <option value="">Unidad</option> {/* Opción vacía */}
                {units.map((unitOption) => ( // Mapea sobre el estado 'units'
                    <option key={unitOption.id} value={unitOption.name}>
                        {unitOption.name}
                    </option>
                ))}
            </select>

            {/* Campo Nombre (ACTUALIZADO con sugerencias) */}
            <div className="ingredient-name-wrapper"> {/* Wrapper para posicionar sugerencias */}
              <input
                type="text"
                placeholder="Nombre del Ingrediente *"
                value={ingredient.name}
                onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                onFocus={() => handleIngredientFocus(index)} // Track focus
                onBlur={handleIngredientBlur} // Ojo con este
                onKeyDown={handleKeyDown} // Manejo de teclado
                required
                className="input-name"
              />
              {/* Lista de Sugerencias */}
              {showSuggestions && focusedIngredientIndex === index && suggestions.length > 0 && (
                <ul className="suggestions-list" ref={suggestionsRef}>
                  {suggestions.map((suggestion, idx) => (
                    <li
                      key={suggestion}
                      className={`suggestion-item ${idx === activeSuggestionIndex ? 'active' : ''}`}
                      // Usar mousedown previene que el blur del input cierre la lista antes del click
                      onMouseDown={() => handleSuggestionClick(suggestion)}
                    >
                      {suggestion}
                    </li>
                  ))}
                </ul>
              )}
            </div>

                  <button
                      type="button"
                      onClick={() => removeIngredient(index)}
                      disabled={ingredients.length <= 1}
                      className="button-remove button"
                  >
                      × {/* Símbolo de multiplicar como 'x' */}
                  </button>
              </div>
          ))}
          <button type="button" onClick={addIngredient} className="button-add button button-default">
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

      <button
                type="submit"
                className="button-submit button button-primary"
                // Deshabilitar si carga datos O si está enviando
                disabled={isLoadingData || isSubmitting}
              >
                {isSubmitting ? 'Guardando...' : (isLoadingData ? 'Cargando...' : (isEditMode ? 'Guardar Cambios' : 'Crear Receta'))}
             </button>
       {/* Mover indicador de carga/error aquí si se aplica al submit */}
        {error && !loadingCategories && <p className="form-error" style={{marginTop: '15px'}}>{error}</p>}
    </form>
  );
}

export default RecipeForm;