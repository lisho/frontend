// src/components/UnitManager.js
import React, { useState, useEffect, useCallback } from 'react';
// IMPORTANTE: Cambiar las importaciones de API
import { getAllUnits, createUnit, updateUnit, deleteUnit } from '../services/api';
import './Manager.css'; // Usar los mismos estilos

function UnitManager() {
  const [units, setUnits] = useState([]); // Cambiar nombre de estado
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [editState, setEditState] = useState({ id: null, name: '' });
  const [newItemName, setNewItemName] = useState('');

  const fetchUnits = useCallback(async () => { // Cambiar nombre de función
    setIsLoading(true);
    setError('');
    try {
      const response = await getAllUnits(); // Cambiar llamada API
      setUnits(response.data || []); // Cambiar setEstado
    } catch (err) {
      setError('Error al cargar unidades.'); // Cambiar mensaje
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUnits(); // Cambiar llamada
  }, [fetchUnits]); // Cambiar dependencia

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    setIsLoading(true);
    setError('');
    try {
      await createUnit({ name: newItemName.trim() }); // Cambiar llamada API
      setNewItemName('');
      await fetchUnits(); // Cambiar llamada
    } catch (err) {
      setError(err.response?.data?.message || 'Error al añadir unidad.'); // Cambiar mensaje
      console.error(err);
      setIsLoading(false);
    }
  };

  const handleEdit = (unit) => { // Cambiar parámetro
    setEditState({ id: unit.id, name: unit.name });
    setNewItemName('');
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
          await updateUnit(editState.id, { name: editState.name.trim() }); // Cambiar llamada API
          handleCancelEdit();
          await fetchUnits(); // Cambiar llamada
      } catch (err) {
         setError(err.response?.data?.message || 'Error al actualizar unidad.'); // Cambiar mensaje
         console.error(err);
         setIsLoading(false);
      }
  };

  const handleDelete = async (id, name) => {
    // Confirmación simple para unidades
    if (window.confirm(`¿Estás seguro de eliminar la unidad "${name}"?`)) {
        setIsLoading(true);
        setError('');
        try {
            await deleteUnit(id); // Cambiar llamada API
            await fetchUnits(); // Cambiar llamada
             if (editState.id === id) {
                handleCancelEdit();
             }
        } catch (err) {
             setError(err.response?.data?.message || 'Error al eliminar unidad.'); // Cambiar mensaje
             console.error(err);
             setIsLoading(false);
        }
    }
  };

  // --- JSX (Adaptar textos y variables) ---
  return (
    <div className="manager-container">
      {error && <p className="error-message">{error}</p>}

      <form onSubmit={handleAdd} className="manager-form add-form">
        <input
          type="text"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          placeholder="Nueva unidad" // Cambiar placeholder
          disabled={isLoading || editState.id !== null}
          required
        />
        <button type="submit" className="button button-secondary" disabled={isLoading || editState.id !== null}>
          Añadir
        </button>
      </form>

      {isLoading && units.length === 0 && <p>Cargando...</p>}
      <ul className="manager-list">
        {units.map((unit) => ( // Cambiar nombre de variable
          <li key={unit.id} className={`manager-item ${editState.id === unit.id ? 'editing' : ''}`}>
            {editState.id === unit.id ? (
               <form onSubmit={handleUpdate} className="manager-form edit-form">
                 <input
                   type="text"
                   value={editState.name}
                   onChange={(e) => setEditState({ ...editState, name: e.target.value })}
                   autoFocus
                   required
                 />
                 <div className="item-actions">
                    <button type="submit" className="button button-primary" disabled={isLoading}>Guardar</button>
                    <button type="button" className="button button-default" onClick={handleCancelEdit} disabled={isLoading}>Cancelar</button>
                 </div>
               </form>
            ) : (
               <>
                 <span className="item-name">{unit.name}</span>
                 <div className="item-actions">
                   <button onClick={() => handleEdit(unit)} className="button button-secondary" disabled={isLoading || editState.id !== null}>Editar</button>
                   <button onClick={() => handleDelete(unit.id, unit.name)} className="button button-danger" disabled={isLoading || editState.id !== null}>Eliminar</button>
                 </div>
               </>
            )}
          </li>
        ))}
      </ul>
      {isLoading && units.length > 0 && <p>Actualizando...</p>}
    </div>
  );
}

export default UnitManager;