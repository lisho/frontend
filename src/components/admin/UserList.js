// src/components/admin/UserList.js
import React, { useState, useEffect, useCallback } from 'react';
import { getAllUsers, updateUser, deleteUser } from '../../services/api'; // API para admin
import { useAuth } from '../../context/AuthContext'; // Para no borrar al admin actual
import './UserList.css'; // Estilos específicos

function UserList() {
  const { user: currentUser } = useAuth(); // Para comparar IDs
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  // Estado para edición inline (opcional)
  const [editingUser, setEditingUser] = useState(null); // { id: userId, role: currentRole }

  const fetchUsers = useCallback(async () => {
    setIsLoading(true); setError('');
    try {
      const response = await getAllUsers();
      setUsers(response.data || []);
    } catch (err) {
      setError('Error al cargar usuarios.'); console.error(err);
    } finally { setIsLoading(false); }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleRoleChange = async (userId, newRole) => {
      if (!userId || !newRole) return;
      // No permitir cambiar el rol del admin actual
      if (userId === currentUser?.id) {
          alert("No puedes cambiar tu propio rol.");
          return;
      }
      setIsLoading(true); setError('');
      try {
          await updateUser(userId, { role: newRole });
          setEditingUser(null); // Salir modo edición
          await fetchUsers(); // Recargar
      } catch (err) {
          setError(err.response?.data?.message || 'Error al cambiar rol.');
          console.error(err);
          setIsLoading(false);
      }
  };

  const handleDelete = async (userId, username) => {
      if (userId === currentUser?.id) {
          alert("No puedes eliminar tu propia cuenta.");
          return;
      }
      if (window.confirm(`¿Estás seguro de eliminar al usuario "${username}"? Esta acción es irreversible.`)) {
          setIsLoading(true); setError('');
          try {
              await deleteUser(userId);
              await fetchUsers(); // Recargar
          } catch (err) {
              setError(err.response?.data?.message || 'Error al eliminar usuario.');
              console.error(err);
              setIsLoading(false);
          }
      }
  };

  const startEdit = (user) => {
     if (user.id === currentUser?.id) return; // No editarse a sí mismo aquí
     setEditingUser({ id: user.id, role: user.role });
  };
  const cancelEdit = () => {
      setEditingUser(null);
  };


  if (isLoading && users.length === 0) return <p>Cargando usuarios...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="user-list-container">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>
                  {editingUser?.id === user.id ? (
                      <select
                          value={editingUser.role}
                          onChange={(e) => setEditingUser({...editingUser, role: e.target.value})}
                          disabled={isLoading}
                      >
                          <option value="user">user</option>
                          <option value="admin">admin</option>
                      </select>
                  ) : (
                      user.role
                  )}
              </td>
              <td>
                <div className="action-buttons">
                   {editingUser?.id === user.id ? (
                       <>
                           <button onClick={() => handleRoleChange(user.id, editingUser.role)} className="button button-primary save" disabled={isLoading}>Guardar</button>
                           <button onClick={cancelEdit} className="button button-default cancel" disabled={isLoading}>Cancelar</button>
                       </>
                   ) : (
                       <>
                           <button onClick={() => startEdit(user)} className="button button-secondary edit" disabled={isLoading || editingUser !== null || user.id === currentUser?.id}>Editar Rol</button>
                           <button onClick={() => handleDelete(user.id, user.username)} className="button button-danger delete" disabled={isLoading || editingUser !== null || user.id === currentUser?.id}>Eliminar</button>
                       </>
                   )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
       {isLoading && users.length > 0 && <p>Actualizando...</p>}
    </div>
  );
}
export default UserList;