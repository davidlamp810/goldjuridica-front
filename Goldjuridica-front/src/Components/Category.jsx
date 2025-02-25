import React, { useState, useEffect } from 'react';
import { getAllCategory } from '../api/category-Apis';
import { useCateringStates } from '../Components/utils/globalContext'; // Importa el estado global

const Category = ({ onCategorySelect, selectedCategories = [] }) => {
    const { state } = useCateringStates();  // Accede al estado global
    const { userData } = state;  // Obtén userData desde el estado global

    // Si hay alguien logueado, no renderizamos el componente
    if (userData) {
        return null;  // No renderiza el componente si hay un usuario logueado
    }

    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            const allCategories = await getAllCategory();
            if (allCategories && allCategories.length > 0) {
                const shuffledCategories = allCategories.sort(() => 0.5 - Math.random());
                const selectedCategories = shuffledCategories.slice(0, 4);
                setCategories(selectedCategories);
            }
        };

        fetchCategories();
    }, []);

    const handleCategoryClick = (category) => {
        let updatedCategories;
        if (selectedCategories.some(cat => cat.id === category.id)) {
            // Si la categoría ya está seleccionada, la quitamos
            updatedCategories = selectedCategories.filter(cat => cat.id !== category.id);
        } else {
            // Si la categoría no está seleccionada, la añadimos
            updatedCategories = [...selectedCategories, category];
        }
        onCategorySelect(updatedCategories); // Pasar objetos completos al componente padre
    };

    return (
        <div>
            <h3 className="search-heading">Categorías</h3>
            <div className="category-container">
                {categories.map((category, index) => (
                    <div 
                        key={index} 
                        className={`category-item ${selectedCategories.some(cat => cat.id === category.id) ? 'selected' : ''}`} 
                        onClick={() => handleCategoryClick(category)}
                    >
                        {category.nombre}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Category;
