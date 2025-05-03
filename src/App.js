// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

// Importa los nuevos componentes
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Importa las páginas
import HomePage from './pages/HomePage';
import RecipeDetailPage from './pages/RecipeDetailPage';
import AddEditRecipePage from './pages/AddEditRecipePage';
import ManageDataPage from './pages/ManageDataPage'; 
import CategoryPage from './pages/CategoryPage'; // <-- Importar

// Importa los estilos globales restantes de App (si los hay)
import './App.css';

// Wrapper de contenido
function AppContent() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();

    // Cierra menú al navegar
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location]);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    // Ajusta esta altura al valor exacto en Navbar.css
    const headerHeight = '60px'; // <-- ACTUALIZA ESTA ALTURA

    return (
        // El padding se aplica aquí para empujar el contenido
        <div className="App" style={{ paddingTop: headerHeight }}>

            {/* Renderiza el componente Navbar */}
            <Navbar
                isMobileMenuOpen={isMobileMenuOpen}
                toggleMobileMenu={toggleMobileMenu}
            />

            {/* --- Contenido Principal --- */}
            <main className="content">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/recipe/:id" element={<RecipeDetailPage />} />
                    <Route path="/add-recipe" element={<AddEditRecipePage />} />
                    <Route path="/edit-recipe/:id" element={<AddEditRecipePage />} />
                    <Route path="*" element={<h2>Página no encontrada (404)</h2>} />
                    <Route path="/manage-data" element={<ManageDataPage />} /> {/* <-- Nueva Ruta */}
                    <Route path="*" element={<h2>Página no encontrada (404)</h2>} />
                    <Route path="/category/:categoryId" element={<CategoryPage />} />
                    <Route path="*" element={<h2>Página no encontrada (404)</h2>} />
                </Routes>
            </main>

            {/* Renderiza el componente Footer */}
            <Footer />

        </div>
    );
}

// Componente principal
function App() {
    return (
        <Router>
            <AppContent />
        </Router>
    );
}

export default App;