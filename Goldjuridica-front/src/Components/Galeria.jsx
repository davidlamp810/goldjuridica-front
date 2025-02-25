import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import '../Styles/Galeria.css';
import { Link } from 'react-router-dom';
import { useCateringStates } from '../Components/utils/globalContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

const Galeria = ({ searchTerm = '', setNoResults, selectedCategories = [], setTotalResults }) => {
  const { state } = useCateringStates();
  const { favs, userData } = state;  // Asegúrate de tener userData aquí

  // Solo renderizar si no hay usuario logueado
  if (userData) {
    return null;  // No renderiza el componente si hay alguien logueado
  }

  const [images, setImages] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [imagesPerPage, setImagesPerPage] = useState(8);
  const [favoriteStatus, setFavoriteStatus] = useState({});

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/productos?pageSize=1000000');
        const productos = response.data.productos;
        const allImages = productos.flatMap(producto => producto.imagenes.map(imagen => ({
          src: imagen.url,
          title: producto.nombre,
          description: producto.descripcion,
          id: producto.id,
          keywords: producto.keywords,
          categoria_id: producto.categoria_id
        })));

        const filteredImages = allImages.filter(image => {
          const matchesSearchTerm = searchTerm
            ? image.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
              image.keywords.toLowerCase().includes(searchTerm.toLowerCase())
            : true;

          const matchesCategory = selectedCategories.length === 0 ||
            selectedCategories.some(cat => cat === image.categoria_id);

          return matchesSearchTerm && matchesCategory;
        });

        const shuffledImages = shuffleArray(filteredImages);

        setImages(shuffledImages);
        setNoResults(shuffledImages.length === 0);
        setTotalResults(shuffledImages.length);
      } catch (error) {
        console.error('Error al obtener las imágenes:', error);
        setNoResults(true);
      }
    };

    fetchImages();
  }, [searchTerm, selectedCategories, setNoResults, setTotalResults]);

  useEffect(() => {
    const handleResize = () => {
      setImagesPerPage(window.innerWidth <= 1000 ? 4 : 8);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const shuffleArray = (array) => {
    let shuffledArray = array.slice();
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
  };

  const toggleFavorito = (productoId) => {
    console.log("Datos enviados a la API:", { usuarioId: state.userData.id, productoId });
    axios.post(`http://localhost:3000/api/favoritos`, { usuarioId: state.userData.id, productoId })
      .then(response => {
        console.log(response.data.message);
        setFavoriteStatus(prevState => ({
          ...prevState,
          [productoId]: !prevState[productoId]
        }));
      })
      .catch(error => console.error("Error al eliminar favorito:", error));
  };

  const nextPage = () => {
    if ((currentPage + 1) * imagesPerPage < images.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const currentImages = images.slice(currentPage * imagesPerPage, (currentPage + 1) * imagesPerPage);

  return (
    <div>
      <div className="gallery">
        {currentImages.map((image, index) => (
          <div key={index} className="image-card">
            <img src={image.src} alt={`img-${index}`} />
            <Link to={`/detail/${image.id}`}>
              <div className="image-info">
                <h2>{image.title}</h2>
                <p>{image.description}</p>
              </div>
            </Link>
            <button
              onClick={() => toggleFavorito(image.id)}
              className={`favButton ${favoriteStatus[image.id] && state.userData ? 'favorite' : ''}`}>
              <FontAwesomeIcon icon={faHeart} />
            </button>
          </div>
        ))}
      </div>
      <div className="pagination-controls">
        <button onClick={prevPage} disabled={currentPage === 0}>
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
        
        <span className="page-number">{currentPage + 1}</span>

        <button onClick={nextPage} disabled={(currentPage + 1) * imagesPerPage >= images.length}>
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
      </div>
    </div>
  );
};

Galeria.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  setNoResults: PropTypes.func.isRequired,
  selectedCategories: PropTypes.array.isRequired,
  setTotalResults: PropTypes.func.isRequired,
};

export default Galeria;
