// src/pages/ManageDataPage.js
import React from 'react';
import CategoryManager from '../components/CategoryManager';
import UnitManager from '../components/UnitManager';
import './ManageDataPage.css'; // Estilos para esta página

function ManageDataPage() {
  return (
    <div className="manage-data-page">
      <h1>Gestionar Datos</h1>

      <section className="management-section">
        <h2>Categorías</h2>
        <CategoryManager />
      </section>

      <hr className="section-divider" />

      <section className="management-section">
        <h2>Unidades</h2>
        <UnitManager />
      </section>
    </div>
  );
}

export default ManageDataPage;