// src/components/auth/ProtectedRoute.js
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// roleRequired: opcional, si es una ruta solo para admin
function ProtectedRoute({ roleRequired }) {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation(); // Para redirigir a la página original después del login

  if (isLoading) {
    // Muestra algo mientras se verifica el estado de autenticación inicial
    return <p>Verificando autenticación...</p>; // O un Spinner
  }

  if (!isAuthenticated) {
    // No autenticado, redirige a login, guardando la ruta a la que quería ir
    console.log("ProtectedRoute: No autenticado, redirigiendo a login desde", location.pathname);
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Autenticado, pero ¿requiere rol específico?
  if (roleRequired && user?.role !== roleRequired) {
    // No tiene el rol necesario, redirige a una página de "no autorizado" o a la home
     console.log(`ProtectedRoute: Rol ${user?.role} no autorizado para ${roleRequired}. Redirigiendo.`);
    return <Navigate to="/" replace />; // O a una página /unauthorized
  }

  // Autenticado y con rol correcto (o no se requiere rol), renderiza el contenido de la ruta
  return <Outlet />; // Renderiza el componente hijo definido en la ruta
}

export default ProtectedRoute;