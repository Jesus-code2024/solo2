// src/components/MainNavbar.js
import React, { useEffect, useState } from 'react';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import tecsupLogoHeader from '../assets/Logo-Header.png';


import '../MainNavbar.css';


function MainNavbar() {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userEmail, setUserEmail] = useState(null);

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem('jwtToken');
            const email = localStorage.getItem('emailLoggedIn');
            setIsAuthenticated(!!token);
            setUserEmail(email);
        };

        checkAuth();

        window.addEventListener('storage', checkAuth);

        return () => {
            window.removeEventListener('storage', checkAuth);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('emailLoggedIn');
        window.dispatchEvent(new Event('storage'));
        navigate('/login');
        console.log('Sesión cerrada. Redirigiendo a /login.');
    };

    return (
        <Navbar bg="dark" variant="dark" expand="lg" className="main-navbar-custom">
            <Container fluid>
                <Navbar.Brand as={Link} to="/home" className="d-flex align-items-center">
                    <img
                        src={tecsupLogoHeader}
                        alt="Tecsup Logo"
                        className="navbar-logo me-2"
                        style={{ height: '40px' }}
                    />
                    <span className="navbar-brand-text">Tecsup Anuncios</span>
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="main-navbar-nav" />

                <Navbar.Collapse id="main-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/home">Inicio</Nav.Link>
                        <Nav.Link as={Link} to="/publications">Publicaciones</Nav.Link>
                        <Nav.Link as={Link} to="/carreras">Carreras</Nav.Link>
                        <Nav.Link as={Link} to="/departamentos">Departamentos</Nav.Link>
                        <Nav.Link as={Link} to="/eventos">Eventos</Nav.Link>
                        <Nav.Link as={Link} to="/webinars">Webinars</Nav.Link>
                    </Nav>

                    <Nav className="ms-auto align-items-center">
                        {isAuthenticated ? (
                            <>
                                {/* CAMBIO AQUÍ: De "Crear Evento" a "Perfil" y la ruta */}
                                <Button
                                    variant="outline-light"
                                    className="me-3 nav-button-profile" // Clase para estilos y margen
                                    onClick={() => navigate('/perfil')} // Navega a la nueva página de perfil
                                >
                                    Perfil
                                </Button>

                                {userEmail && <span className="text-light me-3 user-email-text">{userEmail}</span>}

                                <Button variant="danger" onClick={handleLogout}>
                                    Cerrar Sesión
                                </Button>
                            </>
                        ) : (
                            <Button variant="outline-light" onClick={() => navigate('/login')}>
                                Iniciar Sesión
                            </Button>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default MainNavbar;