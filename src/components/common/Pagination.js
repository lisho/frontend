// src/components/common/Pagination.js
import React from 'react';
import './Pagination.css'; // Necesitaremos estilos

function Pagination({ currentPage, totalPages, onPageChange }) {
    if (totalPages <= 1) {
        return null; // No mostrar paginación si solo hay una página o menos
    }

    const handlePrevious = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    // Lógica para mostrar números de página (simplificado por ahora)
    // En una versión más avanzada, mostrarías números específicos y '...'
    const renderPageNumbers = () => {
        // Por ahora, solo mostramos la página actual y el total
        return (
            <span className="page-info">
                Página {currentPage} de {totalPages}
            </span>
        );
    };

    return (
        <div className="pagination-container">
            <button
                onClick={handlePrevious}
                disabled={currentPage === 1}
                className="pagination-button prev"
            >
                « Anterior
            </button>

            {renderPageNumbers()}

            <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className="pagination-button next"
            >
                Siguiente »
            </button>
        </div>
    );
}

export default Pagination;