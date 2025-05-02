// src/pages/AddEditRecipePage.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import RecipeForm from '../components/RecipeForm';
import { getRecipeById, createRecipe, updateRecipe } from '../services/api';

function AddEditRecipePage() {
  const { id } = useParams(); // Obtiene el ID de la URL si estamos editando
  const navigate = useNavigate(); // Hook para redirigir
  const isEditMode = Boolean(id); // True si hay un ID en la URL

  const [initialData, setInitialData] = useState(null);
  const [isLoading, setIsLoading] = useState(isEditMode); // Carga si estamos en modo edición
  const [error, setError] = useState(null);

  // Si estamos en modo edición, carga los datos de la receta
  useEffect(() => {
    if (isEditMode) {
      const fetchRecipe = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const response = await getRecipeById(id);
          setInitialData(response.data);
        } catch (err) {
          console.error("Error fetching recipe for edit:", err);
          setError('No se pudo cargar la receta para editar. Inténtalo de nuevo.');
          setInitialData(null); // Asegura que no haya datos viejos
        } finally {
          setIsLoading(false);
        }
      };
      fetchRecipe();
    } else {
        setInitialData(null); // Asegura que no haya datos iniciales si estamos creando
    }
  }, [id, isEditMode]); // Depende del ID y del modo

  const handleSaveRecipe = async (recipeData) => {
    setIsLoading(true); // Mostrar indicador de carga durante el guardado
    setError(null);
    try {
      let response;
      if (isEditMode) {
        response = await updateRecipe(id, recipeData);
        console.log("Receta actualizada:", response.data);
        // Navegar a la página de detalles de la receta editada
        navigate(`/recipe/${response.data.id}`);
      } else {
        response = await createRecipe(recipeData);
        console.log("Receta creada:", response.data);
         // Navegar a la página de detalles de la receta creada
        navigate(`/recipe/${response.data.id}`);
      }
    } catch (err) {
      console.error("Error saving recipe:", err);
      // Intenta obtener un mensaje de error más específico del backend si existe
      const backendError = err.response?.data?.message || 'Ocurrió un error al guardar la receta.';
      const validationErrors = err.response?.data?.errors;
      let errorMessage = backendError;
       if (validationErrors) {
         errorMessage += ` Detalles: ${validationErrors.join(', ')}`;
       }

      setError(errorMessage);
      setIsLoading(false); // Detener la carga si hay error
    }
    // No poner setIsLoading(false) aquí si la navegación tiene éxito,
    // porque el componente se desmontará al navegar.
  };

  // Renderizado condicional mientras carga o si hay error
  if (isEditMode && isLoading) {
    return <p>Cargando datos de la receta...</p>;
  }
  if (error && isEditMode && !initialData) {
      // Si hubo un error cargando la receta para editar
      return <p className="error-message">{error}</p>;
  }

  return (
    <div>
      {/* Renderiza el formulario.
          Si es modo edición y hay initialData, pásalos.
          Si es modo añadir, initialData será null.
          Pasamos la función que maneja el guardado.
      */}
      <RecipeForm
        initialData={initialData}
        onSubmit={handleSaveRecipe}
        isEditMode={isEditMode}
      />
      {/* Muestra el error de guardado debajo del formulario */}
      {error && <p className="form-error" style={{marginTop: '15px'}}>{error}</p>}
      {isLoading && <p>Guardando...</p>} {/* Indicador de carga durante el envío */}
    </div>
  );
}

export default AddEditRecipePage;