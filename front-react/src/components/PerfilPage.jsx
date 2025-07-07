import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button, Alert, Spinner, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const API_BASE_URL = 'http://localhost:8080/api'; // URL base de tu API

function PerfilPage() {
    const [userEvents, setUserEvents] = useState([]);
    const [userWebinars, setUserWebinars] = useState([]); // Nuevo estado para webinars
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [currentUserId, setCurrentUserId] = useState(null);
    const [userEmail, setUserEmail] = useState(null); // Para mostrar el correo
    const [userProfilePic, setUserProfilePic] = useState(null); // Para la foto de perfil

    // Función para obtener los headers de autorización
    const getAuthHeaders = () => {
        const token = localStorage.getItem('jwtToken');
        return token ? { Authorization: `Bearer ${token}` } : {};
    };

    // 1. Decodificar el token para obtener el ID, email y foto de perfil del usuario
    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                setCurrentUserId(decodedToken.sub); // Asumimos 'sub' es el ID numérico del usuario
                setUserEmail(decodedToken.email); // Asumimos 'email' es el correo del usuario
                // Asumimos 'picture' es la URL de la foto de perfil de Google
                setUserProfilePic(decodedToken.picture || 'https://via.placeholder.com/150?text=Perfil');
            } catch (err) {
                console.error("Error decodificando el token:", err);
                setError("Token inválido. Por favor, inicie sesión de nuevo.");
                localStorage.removeItem('jwtToken');
                navigate('/login');
            }
        } else {
            navigate('/login');
        }
    }, [navigate]);

    // Función para cargar los eventos y webinars del usuario
    const fetchUserContent = async () => {
        if (!currentUserId) return;

        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${API_BASE_URL}/eventos/autor/${currentUserId}`, {
                headers: getAuthHeaders()
            });

            // Aquí filtramos los eventos y webinars.
            // Asumo que tienes una propiedad 'esWebinar' o 'tipo' en tus eventos.
            // Si no, necesitarás ajustar esta lógica o la forma en que tu backend diferencia.
            const events = response.data.filter(item => item.tipo !== 'WEBINAR' && item.tipo !== 'ONLINE'); // Ajusta según tu campo
            const webinars = response.data.filter(item => item.tipo === 'WEBINAR' || item.tipo === 'ONLINE'); // Ajusta según tu campo

            setUserEvents(events);
            setUserWebinars(webinars);
        } catch (err) {
            console.error('Error al cargar el contenido del usuario:', err);
            setError('No se pudo cargar tu contenido. Por favor, intente de nuevo.');
            if (err.response && err.response.status === 401) {
                localStorage.removeItem('jwtToken');
                navigate('/login');
            } else if (err.response && err.response.status === 403) {
                setError('No tienes permiso para ver este contenido.');
            }
        } finally {
            setLoading(false);
        }
    };

    // Cargar eventos y webinars del usuario al montar y cuando cambie el ID del usuario
    useEffect(() => {
        fetchUserContent();
    }, [currentUserId, navigate]);

    // Función para manejar la eliminación de un evento o webinar
    const handleDeleteContent = async (contentId, type) => { // 'type' puede ser 'evento' o 'webinar' si las rutas de eliminación son diferentes
        const confirmMessage = `¿Estás seguro de que quieres eliminar este ${type}?`;
        if (window.confirm(confirmMessage)) {
            try {
                // Asumo que la API de eliminación es la misma para ambos.
                await axios.delete(`${API_BASE_URL}/eventos/${contentId}`, {
                    headers: getAuthHeaders()
                });
                alert(`${type.charAt(0).toUpperCase() + type.slice(1)} eliminado con éxito.`);
                fetchUserContent(); // Recargar el contenido después de la eliminación
            } catch (err) {
                console.error(`Error al eliminar el ${type}:`, err);
                if (err.response) {
                    if (err.response.status === 401) {
                        setError('No autorizado. Por favor, inicie sesión de nuevo.');
                        localStorage.removeItem('jwtToken');
                        navigate('/login');
                    } else if (err.response.status === 403) {
                        setError(`No tienes permiso para eliminar este ${type}.`);
                    } else if (err.response.data && err.response.data.message) {
                        setError(`Error al eliminar: ${err.response.data.message}`);
                    } else {
                        setError(`Ocurrió un error al eliminar el ${type}.`);
                    }
                } else {
                    setError(`Error de red o conexión al intentar eliminar el ${type}.`);
                }
            }
        }
    };

    if (loading) {
        return (
            <Container className="text-center mt-5">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </Spinner>
                <p>Cargando tu perfil y contenido...</p>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="text-center mt-5">
                <Alert variant="danger">{error}</Alert>
            </Container>
        );
    }

    return (
        <Container className="my-5">
            <Row className="justify-content-center mb-5">
                <Col md={8} className="text-center">
                    <Image
                        src={userProfilePic}
                        roundedCircle
                        style={{ width: '150px', height: '150px', objectFit: 'cover', border: '3px solid #007bff' }}
                        className="mb-3 shadow-sm"
                    />
                    <h1 className="mb-1">Perfil de Usuario</h1>
                    {userEmail && <p className="text-muted lead">{userEmail}</p>}
                    <hr />
                    <div className="d-flex justify-content-center gap-3"> {/* Contenedor para botones de creación */}
                        <Button variant="success" onClick={() => navigate('/evento/new')} className="mt-3">
                            Crear Nuevo Evento Presencial
                        </Button>
                        <Button variant="info" onClick={() => navigate('/webinar/new')} className="mt-3"> {/* Nueva ruta para crear webinar */}
                            Crear Nuevo Webinar Online
                        </Button>
                    </div>
                </Col>
            </Row>

            {/* Sección de Mis Webinars Creados */}
            <h2 className="text-center mb-4">Mis Webinars Creados</h2>
            <Row className="justify-content-center">
                {userWebinars.length > 0 ? (
                    userWebinars.map(webinar => (
                        <Col key={webinar.id} md={6} lg={4} className="mb-4">
                            <Card className="event-card-profile h-100 shadow-sm border-0">
                                <Card.Img
                                    variant="top"
                                    src={webinar.imagen ? `http://localhost:8080/uploads/${webinar.imagen}` : 'https://via.placeholder.com/400x200?text=Webinar+Online'}
                                    alt={webinar.titulo}
                                    style={{ height: '200px', objectFit: 'cover' }}
                                />
                                <Card.Body className="d-flex flex-column">
                                    <Card.Title className="text-primary">{webinar.titulo}</Card.Title>
                                    <Card.Text className="text-muted small mb-2">
                                        <p className="mb-1"><strong>Descripción:</strong> {webinar.descripcion.substring(0, Math.min(webinar.descripcion.length, 100))}...</p>
                                        <p className="mb-1"><strong>Enlace:</strong> <a href={webinar.enlaceWebinar} target="_blank" rel="noopener noreferrer">Ir al Webinar</a></p> {/* Asumo un campo 'enlaceWebinar' */}
                                        <p className="mb-1"><strong>Capacidad:</strong> {webinar.capacidad}</p>
                                        {webinar.fechaInicio && <p className="mb-1"><strong>Fecha Inicio:</strong> {new Date(webinar.fechaInicio).toLocaleDateString()}</p>}
                                        {webinar.fechaFin && <p className="mb-1"><strong>Fecha Fin:</strong> {new Date(webinar.fechaFin).toLocaleDateString()}</p>}
                                        {webinar.carrera && <p className="mb-1"><strong>Carrera:</strong> {webinar.carrera.nombre}</p>}
                                    </Card.Text>
                                    <div className="mt-auto d-flex justify-content-between pt-3 border-top">
                                        <Button variant="outline-primary" size="sm" onClick={() => navigate(`/webinars/${webinar.id}`)}> {/* Nueva ruta para ver detalles del webinar */}
                                            Ver Detalles
                                        </Button>
                                        <Button variant="outline-warning" size="sm" className="ms-2" onClick={() => navigate(`/edit-webinar/${webinar.id}`)}> {/* Nueva ruta para editar webinar */}
                                            Editar
                                        </Button>
                                        <Button
                                            variant="outline-danger"
                                            size="sm"
                                            className="ms-2"
                                            onClick={() => handleDeleteContent(webinar.id, 'webinar')}
                                        >
                                            Eliminar
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))
                ) : (
                    <Col xs={12}>
                        <Alert variant="info" className="text-center shadow-sm">No has creado ningún webinar aún.</Alert>
                        <div className="text-center mt-3">
                            <Button variant="info" onClick={() => navigate('/webinar/new')}>
                                Crear Nuevo Webinar
                            </Button>
                        </div>
                    </Col>
                )}
            </Row>

            {/* Sección de Mis Eventos Creados */}
            <h2 className="text-center mb-4 mt-5">Mis Eventos Presenciales Creados</h2> {/* Título actualizado */}
            <Row className="justify-content-center">
                {userEvents.length > 0 ? (
                    userEvents.map(event => (
                        <Col key={event.id} md={6} lg={4} className="mb-4">
                            <Card className="event-card-profile h-100 shadow-sm border-0">
                                <Card.Img
                                    variant="top"
                                    src={event.imagen ? `http://localhost:8080/uploads/${event.imagen}` : 'https://via.placeholder.com/400x200?text=Sin+Imagen'}
                                    alt={event.titulo}
                                    style={{ height: '200px', objectFit: 'cover' }}
                                />
                                <Card.Body className="d-flex flex-column">
                                    <Card.Title className="text-primary">{event.titulo}</Card.Title>
                                    <Card.Text className="text-muted small mb-2">
                                        <p className="mb-1"><strong>Descripción:</strong> {event.descripcion.substring(0, Math.min(event.descripcion.length, 100))}...</p>
                                        <p className="mb-1"><strong>Ubicación:</strong> {event.ubicacion}</p>
                                        <p className="mb-1"><strong>Capacidad:</strong> {event.capacidad}</p>
                                        {event.fechaInicio && <p className="mb-1"><strong>Fecha Inicio:</strong> {new Date(event.fechaInicio).toLocaleDateString()}</p>}
                                        {event.fechaFin && <p className="mb-1"><strong>Fecha Fin:</strong> {new Date(event.fechaFin).toLocaleDateString()}</p>}
                                        {event.carrera && <p className="mb-1"><strong>Carrera:</strong> {event.carrera.nombre}</p>}
                                    </Card.Text>
                                    <div className="mt-auto d-flex justify-content-between pt-3 border-top">
                                        <Button variant="outline-primary" size="sm" onClick={() => navigate(`/eventos/${event.id}`)}>
                                            Ver Detalles
                                        </Button>
                                        <Button variant="outline-warning" size="sm" className="ms-2" onClick={() => navigate(`/edit-evento/${event.id}`)}>
                                            Editar
                                        </Button>
                                        <Button
                                            variant="outline-danger"
                                            size="sm"
                                            className="ms-2"
                                            onClick={() => handleDeleteContent(event.id, 'evento')}
                                        >
                                            Eliminar
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))
                ) : (
                    <Col xs={12}>
                        <Alert variant="info" className="text-center shadow-sm">No has creado ningún evento presencial aún.</Alert>
                        <div className="text-center mt-3">
                            <Button variant="success" onClick={() => navigate('/evento/new')}>
                                Crear Nuevo Evento Presencial
                            </Button>
                        </div>
                    </Col>
                )}
            </Row>
        </Container>
    );
}

export default PerfilPage;