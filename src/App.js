// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RecipeDetailPage from './pages/RecipeDetailPage';
import AddEditRecipePage from './pages/AddEditRecipePage';
// Importaremos más páginas aquí a medida que las creemos
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        {/* --- Barra de Navegación Simple --- */}
        <nav className="main-nav">
        <ul>
          <li><Link to="/">Inicio</Link></li>
          {/* Nuevo enlace */}
          <li><Link to="/add-recipe">Añadir Receta</Link></li>
        </ul>
        <h1 className="main-title">Mi Recetario Pastel</h1>
      </nav>

        {/* --- Contenido Principal --- */}
        <main className="content">
        <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/recipe/:id" element={<RecipeDetailPage />} />
        {/* Ruta para añadir nueva receta */}
        <Route path="/add-recipe" element={<AddEditRecipePage />} />
        {/* Ruta para editar una receta existente */}
        <Route path="/edit-recipe/:id" element={<AddEditRecipePage />} />
        {/* <Route path="/category/:categoryId" element={<CategoryPage />} /> */}
        {/* Ruta comodín para 404 */}
        <Route path="*" element={<h2>Página no encontrada (404)</h2>} />
      </Routes>
        </main>

        {/* --- Footer Simple --- */}
        <footer className="main-footer">
          <p>© {new Date().getFullYear()} Mi Recetario Pastel</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;