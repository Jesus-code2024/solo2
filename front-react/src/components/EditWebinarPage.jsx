// src/components/EditWebinarPage.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Form, Button, Alert, Row, Col, Card } from 'react-bootstrap';
import { FaVideo, FaCalendarAlt, FaUser, FaLink, FaImage, FaSave, FaTimes, FaSpinner } from 'react-icons/fa';
import '../styles/CreateWebinarPage.css';

const API_URL_WEBINARS = 'http://localhost:8080/api/webinars';

function EditWebinarPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [webinar, setWebinar] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const getAuthHeaders = () => {
        const token = localStorage.getItem('jwtToken');
        return token ? { Authorization: `Bearer ${token}` } : {};
    };

    useEffect(() => {
        const fetchWebinar = async () => {
            try {
                const response = await axios.get(`${API_URL_WEBINARS}/${id}`, { headers: getAuthHeaders() });
                setWebinar(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Error al cargar el webinar para edición:', err);
                setError('No se pudo cargar el webinar para edición. Por favor, verifique el ID.');
                setLoading(false);
                if (err.response && err.response.status === 401) {
                    localStorage.removeItem('jwtToken');
                    navigate('/login');
                }
            }
        };
        fetchWebinar();
    }, [id, navigate]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setWebinar(prev => ({ 
            ...prev, 
            [name]: type === 'checkbox' ? checked : value 
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);
        setSaving(true);
        
        try {
            await axios.put(`${API_URL_WEBINARS}/${id}`, webinar, { headers: getAuthHeaders() });
            setSuccess(true);
            
            // Marcar que se actualizó un webinar para refrescar la página de webinars
            sessionStorage.setItem('webinarUpdated', 'true');
            
            setTimeout(() => {
                navigate('/webinars');
            }, 1500);
        } catch (err) {
            console.error('Error al actualizar el webinar:', err);
            if (err.response && err.response.status === 403) {
                setError('No tienes permiso para editar este webinar (solo el autor puede).');
            } else {
                setError('No se pudo actualizar el webinar. Por favor, intente de nuevo.');
            }
            if (err.response && err.response.status === 401) {
                localStorage.removeItem('jwtToken');
                navigate('/login');
            }
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="create-webinar-page">
                <Container className="py-5">
                    <Row className="justify-content-center">
                        <Col lg={8}>
                            <Card className="shadow-lg border-0">
                                <Card.Body className="text-center p-5">
                                    <FaSpinner className="fa-spin mb-3" size={32} />
                                    <h4>Cargando webinar...</h4>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
    
    if (error && !webinar) {
        return (
            <div className="create-webinar-page">
                <Container className="py-5">
                    <Row className="justify-content-center">
                        <Col lg={8}>
                            <Alert variant="danger" className="text-center">{error}</Alert>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
    
    if (!webinar) {
        return (
            <div className="create-webinar-page">
                <Container className="py-5">
                    <Row className="justify-content-center">
                        <Col lg={8}>
                            <Alert variant="info" className="text-center">Webinar no encontrado.</Alert>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }

    return (
        <div className="create-webinar-page">
            <Container className="py-5">
                <Row className="justify-content-center">
                    <Col lg={8}>
                        <Card className="shadow-lg border-0">
                            <Card.Header className="bg-primary text-white py-4">
                                <div className="d-flex align-items-center">
                                    <FaVideo className="me-3" size={24} />
                                    <h2 className="mb-0">Editar Webinar</h2>
                                </div>
                            </Card.Header>
                            <Card.Body className="p-4">
                                {error && (
                                    <Alert variant="danger" className="d-flex align-items-center">
                                        <FaTimes className="me-2" />
                                        {error}
                                    </Alert>
                                )}
                                {success && (
                                    <Alert variant="success" className="d-flex align-items-center">
                                        <FaSave className="me-2" />
                                        ¡Webinar actualizado exitosamente! Redirigiendo...
                                    </Alert>
                                )}
                                
                                <Form onSubmit={handleSubmit}>
                                    <Row>
                                        <Col md={12}>
                                            <Form.Group className="mb-3">
                                                <Form.Label className="fw-bold">
                                                    <FaVideo className="me-2" />
                                                    Título del Webinar *
                                                </Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="titulo"
                                                    value={webinar.titulo || ''}
                                                    onChange={handleChange}
                                                    placeholder="Ingresa el título del webinar"
                                                    required
                                                    className="form-control-lg"
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label className="fw-bold">
                                                    <FaCalendarAlt className="me-2" />
                                                    Fecha y Hora *
                                                </Form.Label>
                                                <Form.Control
                                                    type="datetime-local"
                                                    name="fecha"
                                                    value={webinar.fecha ? new Date(webinar.fecha).toISOString().slice(0, 16) : ''}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label className="fw-bold">
                                                    <FaUser className="me-2" />
                                                    Expositor
                                                </Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="expositor"
                                                    value={webinar.expositor || ''}
                                                    onChange={handleChange}
                                                    placeholder="Nombre del expositor"
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col md={12}>
                                            <Form.Group className="mb-3">
                                                <Form.Label className="fw-bold">Descripción</Form.Label>
                                                <Form.Control
                                                    as="textarea"
                                                    rows={4}
                                                    name="descripcion"
                                                    value={webinar.descripcion || ''}
                                                    onChange={handleChange}
                                                    placeholder="Describe el contenido del webinar..."
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label className="fw-bold">
                                                    <FaLink className="me-2" />
                                                    Enlace del Webinar
                                                </Form.Label>
                                                <Form.Control
                                                    type="url"
                                                    name="enlace"
                                                    value={webinar.enlace || ''}
                                                    onChange={handleChange}
                                                    placeholder="https://ejemplo.com/webinar"
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label className="fw-bold">
                                                    <FaImage className="me-2" />
                                                    URL de Imagen
                                                </Form.Label>
                                                <Form.Control
                                                    type="url"
                                                    name="imagen"
                                                    value={webinar.imagen || ''}
                                                    onChange={handleChange}
                                                    placeholder="https://ejemplo.com/imagen.jpg"
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col md={12}>
                                            <Form.Group className="mb-4">
                                                <Form.Check
                                                    type="checkbox"
                                                    id="destacado"
                                                    name="destacado"
                                                    label="Marcar como webinar destacado"
                                                    checked={webinar.destacado || false}
                                                    onChange={handleChange}
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    {/* Vista previa de imagen */}
                                    {webinar.imagen && (
                                        <Row>
                                            <Col md={12}>
                                                <div className="mb-4">
                                                    <h6 className="fw-bold">Vista previa de imagen:</h6>
                                                    <img 
                                                        src={webinar.imagen} 
                                                        alt="Vista previa"
                                                        className="img-fluid rounded"
                                                        style={{ maxHeight: '200px', objectFit: 'cover' }}
                                                        onError={(e) => {
                                                            e.target.style.display = 'none';
                                                        }}
                                                    />
                                                </div>
                                            </Col>
                                        </Row>
                                    )}

                                    <div className="d-flex justify-content-between">
                                        <Button 
                                            variant="outline-secondary" 
                                            onClick={() => navigate('/webinars')}
                                            disabled={saving}
                                        >
                                            <FaTimes className="me-2" />
                                            Cancelar
                                        </Button>
                                        <Button 
                                            variant="primary" 
                                            type="submit"
                                            disabled={saving}
                                        >
                                            {saving ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                    Guardando...
                                                </>
                                            ) : (
                                                <>
                                                    <FaSave className="me-2" />
                                                    Guardar Cambios
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default EditWebinarPage;