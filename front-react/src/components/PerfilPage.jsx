// src/components/PerfilPage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Asegúrate de haberlo instalado

const API_BASE_URL = 'http://localhost:8080/api'; // URL base de tu API

function PerfilPage() {
    const [userEvents, setUserEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [currentUserId, setCurrentUserId] = useState(null);

    // Función para obtener los headers de autorización
    const getAuthHeaders = () => {
        const token = localStorage.getItem('jwtToken');
        return token ? { Authorization: `Bearer ${token}` } : {};
    };

    // 1. Decodificar el token para obtener el ID del usuario
    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                // ATENCIÓN: Ajusta 'decodedToken.sub' si tu JWT usa otro campo para el ID del usuario.
                // Asumimos que 'sub' es el ID numérico del usuario.
                setCurrentUserId(decodedToken.sub);
            } catch (err) {
                console.error("Error decodificando el token:", err);
                setError("Token inválido. Por favor, inicie sesión de nuevo.");
                localStorage.removeItem('jwtToken'); // Token inválido, cerrar sesión
                navigate('/login');
            }
        } else {
            navigate('/login'); // No hay token, redirigir a login
        }
    }, [navigate]);

    // Función para cargar los eventos del usuario
    const fetchUserEvents = async () => {
        if (!currentUserId) return; // Esperar a que el userId esté disponible

        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${API_BASE_URL}/eventos/autor/${currentUserId}`, {
                headers: getAuthHeaders()
            });
            setUserEvents(response.data);
        } catch (err) {
            console.error('Error al cargar los eventos del usuario:', err);
            setError('No se pudieron cargar tus eventos. Por favor, intente de nuevo.');
            if (err.response && err.response.status === 401) {
                localStorage.removeItem('jwtToken');
                navigate('/login');
            } else if (err.response && err.response.status === 403) {
                setError('No tienes permiso para ver estos eventos.');
            }
        } finally {
            setLoading(false);
        }
    };

    // Cargar eventos del usuario al montar y cuando cambie el ID del usuario
    useEffect(() => {
        fetchUserEvents();
    }, [currentUserId, navigate]);

    // Función para manejar la eliminación de un evento
    const handleDeleteEvent = async (eventId) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este evento?')) {
            try {
                await axios.delete(`${API_BASE_URL}/eventos/${eventId}`, {
                    headers: getAuthHeaders()
                });
                // Si la eliminación es exitosa, recargar la lista de eventos
                alert('Evento eliminado con éxito.');
                fetchUserEvents(); // Vuelve a cargar los eventos para actualizar la lista
            } catch (err) {
                console.error('Error al eliminar el evento:', err);
                if (err.response) {
                    // Mensajes de error más específicos del backend
                    if (err.response.status === 401) {
                        setError('No autorizado. Por favor, inicie sesión de nuevo.');
                        localStorage.removeItem('jwtToken');
                        navigate('/login');
                    } else if (err.response.status === 403) {
                        setError('No tienes permiso para eliminar este evento.');
                    } else if (err.response.data && err.response.data.message) {
                        setError(`Error al eliminar: ${err.response.data.message}`);
                    } else {
                        setError('Ocurrió un error al eliminar el evento.');
                    }
                } else {
                    setError('Error de red o conexión al intentar eliminar el evento.');
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
                <p>Cargando tus eventos...</p>
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
            <h1 className="text-center mb-4">Mis Eventos Creados</h1>
            <Row className="justify-content-center">
                {userEvents.length > 0 ? (
                    userEvents.map(event => (
                        <Col key={event.id} md={6} lg={4} className="mb-4">
                            <Card className="event-card-profile h-100">
                                <Card.Img
                                    variant="top"
                                    src={event.imagen ? `http://localhost:8080/uploads/${event.imagen}` : 'https://via.placeholder.com/400x200?text=Sin+Imagen'}
                                    alt={event.titulo}
                                    style={{ height: '200px', objectFit: 'cover' }}
                                />
                                <Card.Body className="d-flex flex-column">
                                    <Card.Title>{event.titulo}</Card.Title>
                                    <Card.Text>
                                        <p><strong>Descripción:</strong> {event.descripcion.substring(0, Math.min(event.descripcion.length, 100))}...</p>
                                        <p><strong>Ubicación:</strong> {event.ubicacion}</p>
                                        <p><strong>Capacidad:</strong> {event.capacidad}</p>
                                        {event.fechaInicio && <p><strong>Fecha Inicio:</strong> {new Date(event.fechaInicio).toLocaleDateString()}</p>}
                                        {event.fechaFin && <p><strong>Fecha Fin:</strong> {new Date(event.fechaFin).toLocaleDateString()}</p>}
                                        {event.carrera && <p><strong>Carrera:</strong> {event.carrera.nombre}</p>}
                                    </Card.Text>
                                    <div className="mt-auto d-flex justify-content-between"> {/* d-flex y justify-content-between para alinear botones */}
                                        <Button variant="primary" onClick={() => navigate(`/eventos/${event.id}`)}>
                                            Ver Detalles
                                        </Button>
                                        <Button variant="warning" className="ms-2" onClick={() => navigate(`/edit-evento/${event.id}`)}>
                                            Editar
                                        </Button>
                                        {/* Botón de Eliminar */}
                                        <Button
                                            variant="danger"
                                            className="ms-2"
                                            onClick={() => handleDeleteEvent(event.id)} // Llama a la nueva función
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
                        <Alert variant="info" className="text-center">No has creado ningún evento aún.</Alert>
                        <div className="text-center mt-3">
                            <Button variant="success" onClick={() => navigate('/evento/new')}>
                                Crear Nuevo Evento
                            </Button>
                        </div>
                    </Col>
                )}
            </Row>
        </Container>
    );
}

export default PerfilPage;