// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCateringStates } from '../Components/utils/globalContext';
import { Link} from 'react-router-dom';
import '../Styles/Favorites.css';

const Favorites = () => {
    const { state, dispatch } = useCateringStates();
    const { userData } = state;
    const [favoritos, setFavoritos] = useState([]);

    // Obtener los favoritos al cargar el componente
    useEffect(() => {
        axios.get(`http://localhost:3000/api/favoritos/${userData.rolId}`) // Usar rolId en lugar de id
            .then(response => {
                const favoritosData = response.data;

                // Verificar si hay favoritos antes de hacer el dispatch
                if (favoritosData && favoritosData.length > 0) {
                    setFavoritos(favoritosData);
                    dispatch({type: "REMOVE_ALL"})
                    dispatch({ type: "ADD_FAVORITES", payload: favoritosData });
                } else {
                    console.log("No hay favoritos");
                }
            })
            .catch(error => console.error("Error al obtener favoritos:", error));
    }, [userData.rolId, dispatch]); // Usar rolId en lugar de id

    return (
        <div>
            <section className="favorites">
                <div className="favorites-list">
                {favoritos.length === 0 ? (<p>No hay ningún elemento favorito</p>) : (
                    favoritos.map((product, index) => (
                        <div key={index} className="favorite-card">
                            <img src={product.imagenes.length > 0 ? product.imagenes[0].url : 'default-image.jpg'} alt={`favorite-${index}`} />
                            <div className="favorite-info">
                                <h3>{product.nombre}</h3>
                                <p>{product.descripcion}</p>
                                <div className="favorite-buttons">
                                    <Link to={`/detail/${product.id}`} className="detail-button">
                                        Empezar
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </section>
    </div>
);
};

export default Favorites;
