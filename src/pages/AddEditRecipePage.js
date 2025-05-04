// src/pages/AddEditRecipePage.js
import React, { useState, useEffect, useRef } from 'react'; // Importar useRef
import { useParams, useNavigate } from 'react-router-dom';
import RecipeForm from '../components/recipe/RecipeForm'; // Asegúrate que la ruta es correcta
import { getRecipeById, createRecipe, updateRecipe } from '../services/api';

function AddEditRecipePage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = Boolean(id);

    const [initialData, setInitialData] = useState(null);
    const [isLoadingData, setIsLoadingData] = useState(isEditMode);
    // Mantenemos isSubmitting para la UI (deshabilitar botón, texto "Guardando...")
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    // Usamos un ref para bloquear ejecuciones concurrentes de forma síncrona
    const isAlreadySubmitting = useRef(false);

    // Efecto para cargar datos iniciales (sin cambios respecto a la versión anterior)
    useEffect(() => {
        setInitialData(null);
        setIsLoadingData(isEditMode);
        setError(null);
        setIsSubmitting(false);
        isAlreadySubmitting.current = false; // Resetea el ref también al cambiar modo/ID

        if (isEditMode && id) {
            const fetchRecipe = async () => {
                try {
                    const response = await getRecipeById(id);
                    setInitialData(response.data);
                } catch (err) {
                    console.error("Error fetching recipe for edit:", err);
                    setError('No se pudo cargar la receta para editar. Inténtalo de nuevo más tarde.');
                    setInitialData(null);
                } finally {
                    setIsLoadingData(false);
                }
            };
            fetchRecipe();
        }
    }, [id, isEditMode]);

    // Handler para guardar/actualizar receta
    const handleSaveRecipe = async (recipeData) => {
        // ----- INICIO: Guarda MEJORADA con useRef -----
        // Comprueba el ref síncronamente
        if (isAlreadySubmitting.current) {
            console.warn("handleSaveRecipe: Submit already in progress (ref check), ignoring duplicate call.");
            return; // Salir inmediatamente
        }
        // Marca el inicio de la sumisión en el ref
        isAlreadySubmitting.current = true;
        // ----- FIN: Guarda -----

        // Actualiza el ESTADO para la UI (deshabilitar botón, texto)
        setIsSubmitting(true);
        setError(null);
        console.log("handleSaveRecipe called ONCE (ref passed)"); // Log actualizado
        console.log("handleSaveRecipe: Submitting...", recipeData);

        try {
            let response;
            if (isEditMode) {
                response = await updateRecipe(id, recipeData);
                console.log("Receta actualizada:", response.data);
                navigate(`/recipe/${response.data.id}`);
            } else {
                response = await createRecipe(recipeData);
                console.log("Receta creada:", response.data); // Deberías ver solo un ID aquí
                navigate(`/recipe/${response.data.id}`);
            }
            // El componente se desmontará por la navegación,
            // el reset del ref en el useEffect se encargará al volver/cambiar.
            // Si no hubiera navegación, haríamos: isAlreadySubmitting.current = false; aquí.

        } catch (err) {
            console.error("Error saving recipe:", err);
            const backendError = err.response?.data?.message || 'Ocurrió un error al guardar la receta.';
            const validationErrors = err.response?.data?.errors;
            let errorMessage = backendError;
            if (validationErrors) {
                errorMessage += ` Detalles: ${validationErrors.join(', ')}`;
            }
            setError(errorMessage);

            // IMPORTANTE: Resetear AMBOS si hay error para permitir reintentar
            setIsSubmitting(false);
            isAlreadySubmitting.current = false; // Libera el bloqueo del ref
        }
        // No poner resets fuera del try/catch si la navegación es segura en el try
    };

    // Renderizado condicional mientras carga datos (sin cambios)
    if (isLoadingData) {
        return <p>Cargando datos de la receta...</p>;
    }
    if (error && isEditMode && !initialData) {
        return <p className="error-message">{error}</p>;
    }

    // Renderizado normal del formulario
    return (
        <div>
            <h2>{isEditMode ? 'Editar Receta' : 'Añadir Nueva Receta'}</h2>
            <RecipeForm
                initialData={initialData}
                onSubmit={handleSaveRecipe}
                isEditMode={isEditMode}
                // Sigue pasando los estados para la UI del botón
                isLoadingData={isLoadingData}
                isSubmitting={isSubmitting}
            />
            {/* Mostrar error de envío */}
            {error && !isSubmitting && <p className="error-message" style={{ marginTop: '15px' }}>{error}</p>}
        </div>
    );
}

export default AddEditRecipePage;