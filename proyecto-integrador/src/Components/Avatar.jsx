import React from 'react';
import { Link } from 'react-router-dom';
import { useCateringStates } from '../Components/utils/globalContext'; // Asegúrate de que la ruta sea correcta
import NavbarStyle from '../Styles/Navbar.module.css';


const Avatar = () => {
    const { state } = useCateringStates();
    const { userData } = state;

    // Función para obtener las iniciales del primer nombre y primer apellido
    const getInitials = (nombre, apellido) => {
        const firstInitial = nombre ? nombre.charAt(0).toUpperCase() : '';
        const lastInitial = apellido ? apellido.charAt(0).toUpperCase() : '';
        return `${firstInitial}${lastInitial}`;
    };

    // Función para obtener el primer nombre y primer apellido
    const getFirstNameAndSurname = (nombre, apellido) => {
        const firstName = nombre ? nombre.split(' ')[0] : '';
        const firstSurname = apellido ? apellido.split(' ')[0] : '';
        return `${firstName} ${firstSurname}`;
    };

    console.log('Renderizando Avatar con userData:', userData);
    
    return (
        <div className={NavbarStyle.profile}>
            <div className={NavbarStyle.avatar}>
                {getInitials(userData.nombre, userData.apellido)}
                {userData.rolId === 1 ? <Link to='/adminpanel'>Ir al panel</Link> : null}
            </div>
            <span className={NavbarStyle.userName}>
                {getFirstNameAndSurname(userData.nombre, userData.apellido)}
            </span>
            {userData.rolId === 2 && (
                <Link to='/adminpanel' className={NavbarStyle.panelButton}>
                    Ir al panel
                </Link>
            )}
        </div>
    );
};

export default Avatar;