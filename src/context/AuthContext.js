// src/context/AuthContext.js
import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { login as apiLogin, register as apiRegister, getMyProfile } from '../services/api';
import { setToken, removeToken, getToken, setUserData, removeUserData, getUserData } from '../utils/localStorage'; // Importa helpers
import axios from 'axios'; // Importa axios para setear defaults o interceptores si aún no lo hiciste

// Crear el contexto
const AuthContext = createContext(null);

// Hook para usar el contexto fácilmente
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe usarse dentro de un AuthProvider');
    }
    return context;
};

// Proveedor del contexto
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Almacena { id, username, email, role }
    const [token, setAuthStateToken] = useState(getToken()); // Obtiene token inicial de localStorage
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true); // Para saber si estamos verificando el token inicial

    // Configurar Axios para enviar el token (alternativa al interceptor en api.js)
    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            setIsAuthenticated(true); // Asumir autenticado si hay token (se verificará)
        } else {
            delete axios.defaults.headers.common['Authorization'];
            setIsAuthenticated(false);
        }
    }, [token]);

    // Función para cargar usuario basado en token al inicio o al refrescar
    const loadUser = useCallback(async () => {
        const currentToken = getToken(); // Re-leer por si acaso
        if (!currentToken) {
            setIsLoading(false);
            return; // No hay token, no hacer nada
        }
        setAuthStateToken(currentToken); // Asegura que el estado local esté sincronizado

        try {
            // console.log("AuthContext: Intentando cargar perfil...");
            const response = await getMyProfile(); // Llama a la API para obtener datos frescos
            // console.log("AuthContext: Perfil cargado:", response.data);
            setUser(response.data);
            setUserData(response.data); // Guarda datos en localStorage (opcional)
            setIsAuthenticated(true);
        } catch (error) {
            console.error("AuthContext: Error cargando perfil, token inválido o expirado.", error);
            // Si falla (token inválido/expirado), limpiar todo
            removeToken();
            removeUserData();
            setUser(null);
            setAuthStateToken(null);
            setIsAuthenticated(false);
            delete axios.defaults.headers.common['Authorization'];
        } finally {
            setIsLoading(false); // Termina la carga inicial
        }
    }, []); // useCallback con dependencias vacías

    // Ejecutar loadUser al montar el provider
    useEffect(() => {
        loadUser();
    }, [loadUser]);

    // Función de Login
    const login = async (credentials) => {
        try {
            setIsLoading(true);
            const response = await apiLogin(credentials);
            const { token: newToken, user: loggedInUser } = response.data;

            setToken(newToken);         // Guarda token en localStorage
            setUserData(loggedInUser);  // Guarda datos de usuario (opcional)
            setAuthStateToken(newToken);// Actualiza estado local del token
            setUser(loggedInUser);      // Actualiza estado local del usuario
            setIsAuthenticated(true);
            setIsLoading(false);
            return true; // Éxito
        } catch (error) {
            console.error("Error en login:", error.response?.data?.message || error.message);
            setIsLoading(false);
            throw error; // Re-lanza para manejar en el componente de formulario
        }
    };

    // Función de Registro
    const register = async (userData) => {
        try {
            setIsLoading(true);
            const response = await apiRegister(userData);
            const { token: newToken, user: registeredUser } = response.data;

            setToken(newToken);
            setUserData(registeredUser);
            setAuthStateToken(newToken);
            setUser(registeredUser);
            setIsAuthenticated(true);
            setIsLoading(false);
            return true; // Éxito
        } catch (error) {
            console.error("Error en registro:", error.response?.data?.message || error.message);
            setIsLoading(false);
            throw error;
        }
    };

    // Función de Logout
    const logout = () => {
        // console.log("AuthContext: Logging out...");
        removeToken();
        removeUserData();
        setUser(null);
        setAuthStateToken(null);
        setIsAuthenticated(false);
        delete axios.defaults.headers.common['Authorization'];
        // Opcional: Redirigir o notificar
    };

     // Función para actualizar usuario (ej: después de editar perfil)
    const updateUserState = (updatedUserData) => {
        setUser(updatedUserData);
        setUserData(updatedUserData); // Actualizar localStorage también
    };


    // Valor que proveerá el contexto
    const value = {
        user,
        token,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
        loadUser, // Podría ser útil llamarla manualmente
        updateUserState // Para actualizar desde ProfilePage
    };

    return (
        <AuthContext.Provider value={value}>
            {/* No mostrar nada hasta que la carga inicial termine */}
            {!isLoading ? children : <p>Cargando aplicación...</p> /* O un spinner */}
        </AuthContext.Provider>
    );
};