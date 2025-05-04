// src/pages/UserManagementPage.js
import React from 'react';
import UserList from '../components/admin/UserList'; // Componente a crear

function UserManagementPage() {
  return (
    <div>
      <h1>Gestionar Usuarios</h1>
      <p>Aquí puedes ver, editar roles y eliminar usuarios.</p>
      <UserList />
    </div>
  );
}
export default UserManagementPage;