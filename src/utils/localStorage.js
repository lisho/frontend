// src/utils/localStorage.js

const TOKEN_KEY = 'authToken';
const USER_DATA_KEY = 'userData';

export const setToken = (token) => {
    localStorage.setItem(TOKEN_KEY, token);
};

export const getToken = () => {
    return localStorage.getItem(TOKEN_KEY);
};

export const removeToken = () => {
    localStorage.removeItem(TOKEN_KEY);
};

export const setUserData = (user) => {
    // No guardar contraseña u otros datos sensibles
    const dataToStore = {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
    };
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(dataToStore));
};

export const getUserData = () => {
    const data = localStorage.getItem(USER_DATA_KEY);
    return data ? JSON.parse(data) : null;
};

export const removeUserData = () => {
    localStorage.removeItem(USER_DATA_KEY);
};