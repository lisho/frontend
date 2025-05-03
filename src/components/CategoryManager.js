// src/components/CategoryManager.js
import React, { useState, useEffect, useCallback } from 'react';
import { getAllCategories, createCategory, updateCategory, deleteCategory } from '../services/api';
import './Manager.css'; // Estilos compartidos para los managers

function CategoryManager() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [editState, setEditState] = useState({ id: null, name: '' }); // Para editar/añadir
  const [newItemName, setNewItemName] = useState(''); // Para añadir

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await getAllCategories();
      setCategories(response.data || []);
    } catch (err) {
      setError('Error al cargar categorías.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    setIsLoading(true);
    setError('');
    try {
      await createCategory({ name: newItemName.trim() });
      setNewItemName(''); // Limpiar input
      await fetchCategories(); // Recargar lista
    } catch (err) {
      setError(err.response?.data?.message || 'Error al añadir categoría.');
      console.error(err);
      setIsLoading(false); // Detener carga solo si hay error
    }
  };

  const handleEdit = (category) => {
    setEditState({ id: category.id, name: category.name });
    setNewItemName(''); // Limpiar campo de añadir
  };

  const handleCancelEdit = () => {
    setEditState({ id: null, name: '' });
  };

  const handleUpdate = async (e) => {
      e.preventDefault();
      if (!editState.id || !editState.name.trim()) return;
      setIsLoading(true);
      setError('');
      try {
          await updateCategory(editState.id, { name: editState.name.trim() });
          handleCancelEdit(); // Salir del modo edición
          await fetchCategories(); // Recargar
      } catch (err) {
         setError(err.response?.data?.message || 'Error al actualizar categoría.');
         console.error(err);
         setIsLoading(false);
      }
  };

  const handleDelete = async (id, name) => {
    // Doble confirmación
    if (window.confirm(`¿Estás seguro de eliminar la categoría "${name}"? Esta acción no se puede deshacer.`)) {
        if (window.confirm(`CONFIRMACIÓN FINAL: Eliminar "${name}". Verifica que ninguna receta la esté usando.`)) {
             setIsLoading(true);
             setError('');
            try {
                await deleteCategory(id);
                await fetchCategories(); // Recargar
                 // Si estábamos editando el que se borró, cancelar edición
                 if (editState.id === id) {
                    handleCancelEdit();
                 }
            } catch (err) {
                 setError(err.response?.data?.message || 'Error al eliminar categoría.');
                 console.error(err);
                 setIsLoading(false);
            }
        }
    }
  };

  return (
    <div className="manager-container">
      {error && <p className="error-message">{error}</p>}

      {/* Formulario para Añadir */}
      <form onSubmit={handleAdd} className="manager-form add-form">
        <input
          type="text"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          placeholder="Nueva categoría"
          disabled={isLoading || editState.id !== null} // Deshabilitar si edita
          required
        />
        <button type="submit" className="button button-secondary" disabled={isLoading || editState.id !== null}>
          Añadir
        </button>
      </form>

      {/* Lista / Formulario de Edición */}
      {isLoading && categories.length === 0 && <p>Cargando...</p>}
      <ul className="manager-list">
        {categories.map((cat) => (
          <li key={cat.id} className={`manager-item ${editState.id === cat.id ? 'editing' : ''}`}>
            {editState.id === cat.id ? (
              // Formulario de Edición
               <form onSubmit={handleUpdate} className="manager-form edit-form">
                 <input
                   type="text"
                   value={editState.name}
                   onChange={(e) => setEditState({ ...editState, name: e.target.value })}
                   autoFocus // Enfocar al editar
                   required
                 />
                 <div className="item-actions">
                    <button type="submit" className="button button-primary" disabled={isLoading}>Guardar</button>
                    <button type="button" className="button button-default" onClick={handleCancelEdit} disabled={isLoading}>Cancelar</button>
                 </div>
               </form>
            ) : (
               // Vista Normal
               <>
                 <span className="item-name">{cat.name}</span>
                 <div className="item-actions">
                   <button onClick={() => handleEdit(cat)} className="button button-secondary" disabled={isLoading || editState.id !== null}>Editar</button>
                   <button onClick={() => handleDelete(cat.id, cat.name)} className="button button-danger" disabled={isLoading || editState.id !== null}>Eliminar</button>
                 </div>
               </>
            )}
          </li>
        ))}
      </ul>
      {isLoading && categories.length > 0 && <p>Actualizando...</p>}
    </div>
  );
}

export default CategoryManager;