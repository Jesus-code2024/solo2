// src/components/MainNavbar.js
import React, { useEffect, useState } from 'react';
import { Navbar, Container, Nav, Button, Dropdown, Image } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import tecsupLogoHeader from '../assets/Logo-Header.png';

import '../styles/MainNavbar.css';

// Imagen de perfil por defecto (SVG en base64)
const DEFAULT_PROFILE_ICON = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTIiIGN5PSI2IiByPSI0IiBmaWxsPSIjRjBGMEYwIi8+CjxwYXRoIGQ9Ik00IDIwQzQgMTYuNDQ1IDIxIDYuNTU1IDIwIDIwSDQzIiBzdHJva2U9IiNGMEYwRjAiIHN0cm9va2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgo8L3N2Zz4=';


function MainNavbar() {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userEmail, setUserEmail] = useState(null);
    const [userProfilePic, setUserProfilePic] = useState(DEFAULT_PROFILE_ICON);

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem('jwtToken');
            if (token) {
                try {
                    const decodedToken = jwtDecode(token);
                    setIsAuthenticated(true);
                    setUserEmail(decodedToken.email);
                    setUserProfilePic(decodedToken.picture || DEFAULT_PROFILE_ICON);
                } catch (error) {
                    console.error("Error decodificando el token:", error);
                    setIsAuthenticated(false);
                    setUserEmail(null);
                    setUserProfilePic(DEFAULT_PROFILE_ICON);
                    localStorage.removeItem('jwtToken');
                    localStorage.removeItem('emailLoggedIn');
                }
            } else {
                setIsAuthenticated(false);
                setUserEmail(null);
                setUserProfilePic(DEFAULT_PROFILE_ICON);
            }
        };

        checkAuth();

        window.addEventListener('storage', checkAuth);
        window.addEventListener('localStorageChange', checkAuth);

        return () => {
            window.removeEventListener('storage', checkAuth);
            window.removeEventListener('localStorageChange', checkAuth);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('emailLoggedIn');
        localStorage.removeItem('userProfilePic');
        
        window.dispatchEvent(new Event('storage'));
        window.dispatchEvent(new Event('localStorageChange'));
        
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
                            <Dropdown align="end">
                                <Dropdown.Toggle as={Nav.Link} className="p-0 d-flex align-items-center" id="dropdown-profile">
                                    <Image 
                                        src={userProfilePic} 
                                        roundedCircle 
                                        width="32" 
                                        height="32" 
                                        className="me-2 profile-pic-navbar" 
                                        alt="Perfil"
                                        onError={(e) => {
                                            e.target.src = DEFAULT_PROFILE_ICON;
                                        }}
                                    />
                                    <span className="d-none d-lg-inline text-light user-email-text me-2">{userEmail}</span>
                                </Dropdown.Toggle>

                                <Dropdown.Menu variant="dark">
                                    <Dropdown.ItemText className="text-white-50 small text-center profile-email-dropdown">
                                        {userEmail}
                                    </Dropdown.ItemText>
                                    <Dropdown.Divider />
                                    <Dropdown.Item as={Link} to="/perfil" className="profile-dropdown-item">
                                        <i className="bi bi-person-circle me-2"></i> Mi Perfil
                                    </Dropdown.Item>
                                    {/* SE ELIMINAN LAS OPCIONES "MIS EVENTOS" Y "MIS WEBINARS" */}
                                    <Dropdown.Divider />
                                    <Dropdown.Item onClick={handleLogout} className="profile-dropdown-item text-danger">
                                        <i className="bi bi-box-arrow-right me-2"></i> Cerrar Sesión
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
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