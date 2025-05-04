// src/pages/ProfilePage.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getMyFavorites, updateMyProfile } from '../services/api'; // Importar APIs necesarias
import RecipeCard from '../components/recipe/RecipeCard';
import UserProfileForm from '../components/user/UserProfileForm'; // Asume que este componente existe
import '../pages/HomePage.css'; // Reutilizar grid si es necesario

function ProfilePage() {
    const { user, updateUserState } = useAuth(); // Obtener usuario y función para actualizar estado global
    const [favorites, setFavorites] = useState([]);
    const [loadingFavorites, setLoadingFavorites] = useState(true);
    const [errorFavorites, setErrorFavorites] = useState('');
    const [editError, setEditError] = useState('');
    const [editSuccess, setEditSuccess] = useState('');
    const [isEditing, setIsEditing] = useState(false); // Para mostrar/ocultar form

    // Cargar favoritos
    useEffect(() => {
        const fetchFavorites = async () => {
            setLoadingFavorites(true);
            setErrorFavorites('');
            try {
                const response = await getMyFavorites();
                setFavorites(response.data || []);
            } catch (error) {
                setErrorFavorites('Error al cargar favoritos.');
                console.error(error);
            } finally {
                setLoadingFavorites(false);
            }
        };
        fetchFavorites();
    }, []); // Solo al montar

    // Manejar actualización de perfil
    const handleProfileUpdate = async (profileData) => {
        setEditError('');
        setEditSuccess('');
        try {
            const updatedUser = await updateMyProfile(profileData);
            // Actualizar el estado global en AuthContext Y localStorage
            updateUserState(updatedUser.data);
            setEditSuccess('Perfil actualizado correctamente.');
            setIsEditing(false); // Ocultar formulario después de éxito
        } catch (error) {
             setEditError(error.response?.data?.message || 'Error al actualizar el perfil.');
             console.error(error);
        }
    };

    if (!user) {
        return <p>Cargando perfil...</p>; // O redirigir si llega aquí sin estar logueado
    }

    return (
        <div>
            <h2>Mi Perfil</h2>

            {/* Sección de Datos del Usuario y Edición */}
            <div className="profile-details">
                <p><strong>Nombre de Usuario:</strong> {user.username}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Rol:</strong> {user.role}</p>

                 <button onClick={() => setIsEditing(!isEditing)} className="button button-secondary">
                    {isEditing ? 'Cancelar Edición' : 'Editar Perfil/Contraseña'}
                </button>

                {isEditing && (
                    <div>
                        <hr/>
                        <h3>Editar Información</h3>
                        {editError && <p className="error-message">{editError}</p>}
                        {editSuccess && <p className="success-message">{editSuccess}</p>} {/* Necesitarás estilo para success-message */}
                         {/* Pasar datos iniciales y el handler */}
                        <UserProfileForm
                            initialData={{ username: user.username, email: user.email }}
                            onSubmit={handleProfileUpdate}
                        />
                    </div>
                )}
                 <hr style={{marginTop: '20px'}}/>
            </div>


            {/* Sección de Favoritos */}
            <h3>Mis Recetas Favoritas</h3>
            {loadingFavorites && <p>Cargando favoritos...</p>}
            {errorFavorites && <p className="error-message">{errorFavorites}</p>}
            {!loadingFavorites && favorites.length === 0 && (
                <p>Aún no has añadido ninguna receta a favoritos.</p>
            )}
            {!loadingFavorites && favorites.length > 0 && (
                <div className="recipe-grid"> {/* Reutilizar grid */}
                    {favorites.map(recipe => (
                        <RecipeCard key={recipe.id} recipe={recipe} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default ProfilePage;