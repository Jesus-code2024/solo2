import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Alert, Row, Col, Card } from 'react-bootstrap';
import { FaVideo, FaCalendarAlt, FaUser, FaLink, FaImage, FaSave, FaTimes, FaUpload, FaTrash } from 'react-icons/fa';
import '../styles/CreateWebinarPage.css';

const API_URL_WEBINARS = 'http://localhost:8080/api/webinars';
const BASE_URL = 'http://localhost:8080';

function CreateWebinarPage() {
    const navigate = useNavigate();
    const [webinar, setWebinar] = useState({
        titulo: '',
        descripcion: '',
        fecha: '',
        expositor: '',
        enlace: '',
        imagen: '',
        destacado: false
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [uploadingImage, setUploadingImage] = useState(false);

    const getAuthHeaders = () => {
        const token = localStorage.getItem('jwtToken');
        return token ? { Authorization: `Bearer ${token}` } : {};
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setWebinar(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validar tipo de archivo
            const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
            if (!allowedTypes.includes(file.type)) {
                setError('Por favor selecciona un archivo de imagen válido (JPEG, PNG, GIF, WebP)');
                return;
            }

            // Validar tamaño de archivo (máximo 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setError('La imagen debe ser menor a 5MB');
                return;
            }

            setSelectedFile(file);
            
            // Crear preview de la imagen
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target.result);
            };
            reader.readAsDataURL(file);
            
            setError(null);
        }
    };

    const uploadImage = async () => {
        if (!selectedFile) return null;

        setUploadingImage(true);
        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const response = await axios.post(`${BASE_URL}/api/upload`, formData, {
                headers: {
                    ...getAuthHeaders(),
                    'Content-Type': 'multipart/form-data'
                }
            });
            setUploadingImage(false);
            return response.data.url || response.data.filePath;
        } catch (err) {
            console.error('Error al subir la imagen:', err);
            setUploadingImage(false);
            throw new Error('Error al subir la imagen');
        }
    };

    const removeImage = () => {
        setSelectedFile(null);
        setImagePreview(null);
        setWebinar(prev => ({ ...prev, imagen: '' }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);
        setLoading(true);
        
        try {
            let imageUrl = null;
            
            // Si hay una imagen seleccionada, subirla primero
            if (selectedFile) {
                try {
                    imageUrl = await uploadImage();
                } catch (uploadError) {
                    setError('Error al subir la imagen. Intente de nuevo.');
                    setLoading(false);
                    return;
                }
            }

            // Preparar los datos del webinar en el formato correcto
            const webinarData = {
                titulo: webinar.titulo.trim(),
                descripcion: webinar.descripcion?.trim() || '',
                fecha: webinar.fecha,
                expositor: webinar.expositor?.trim() || '',
                enlace: webinar.enlace?.trim() || '',
                imagen: imageUrl || webinar.imagen || '',
                destacado: webinar.destacado || false
            };

            console.log('Enviando datos del webinar:', webinarData);

            // Enviar como JSON con headers correctos
            const response = await axios.post(API_URL_WEBINARS, webinarData, {
                headers: {
                    ...getAuthHeaders(),
                    'Content-Type': 'application/json'
                }
            });

            console.log('Webinar creado exitosamente:', response.data);
            setSuccess(true);
            
            // Marcar que se creó un webinar para refrescar otras páginas
            sessionStorage.setItem('webinarCreated', 'true');
            
            setTimeout(() => {
                navigate('/webinars');
            }, 1500);
            
        } catch (err) {
            console.error('Error al crear el webinar:', err);
            
            if (err.response) {
                console.log('Response status:', err.response.status);
                console.log('Response data:', err.response.data);
                
                switch (err.response.status) {
                    case 400:
                        setError('Datos inválidos. Verifique que todos los campos requeridos estén completos.');
                        break;
                    case 401:
                        setError('No autorizado. Por favor, inicie sesión de nuevo.');
                        localStorage.removeItem('jwtToken');
                        navigate('/login');
                        break;
                    case 403:
                        setError('No tienes permiso para crear webinars.');
                        break;
                    case 415:
                        setError('Error en el formato de datos. Contacte al administrador.');
                        break;
                    case 500:
                        setError('Error interno del servidor. Intente más tarde.');
                        break;
                    default:
                        setError(err.response.data?.message || 'Error desconocido al crear el webinar.');
                }
            } else if (err.request) {
                setError('Error de conexión. Verifique su conexión a internet.');
            } else {
                setError('Error inesperado. Intente de nuevo.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="create-webinar-page">
            <Container className="py-5">
                <Row className="justify-content-center">
                    <Col lg={8}>
                        <Card className="shadow-lg border-0">
                            <Card.Header className="bg-primary text-white py-4">
                                <div className="d-flex align-items-center">
                                    <FaVideo className="me-3" size={24} />
                                    <h2 className="mb-0">Crear Nuevo Webinar</h2>
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
                                        ¡Webinar creado exitosamente! Redirigiendo...
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
                                                    value={webinar.titulo}
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
                                                    value={webinar.fecha}
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
                                                    value={webinar.expositor}
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
                                                    value={webinar.descripcion}
                                                    onChange={handleChange}
                                                    placeholder="Describe el contenido del webinar..."
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col md={12}>
                                            <Form.Group className="mb-3">
                                                <Form.Label className="fw-bold">
                                                    <FaLink className="me-2" />
                                                    Enlace del Webinar
                                                </Form.Label>
                                                <Form.Control
                                                    type="url"
                                                    name="enlace"
                                                    value={webinar.enlace}
                                                    onChange={handleChange}
                                                    placeholder="https://ejemplo.com/webinar"
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    {/* Sección de subida de imagen */}
                                    <Row>
                                        <Col md={12}>
                                            <Form.Group className="mb-3">
                                                <Form.Label className="fw-bold">
                                                    <FaImage className="me-2" />
                                                    Imagen del Webinar
                                                </Form.Label>
                                                <div className="upload-area border rounded p-3" style={{ backgroundColor: '#f8f9fa' }}>
                                                    {!imagePreview ? (
                                                        <div className="text-center py-3">
                                                            <FaUpload size={48} className="text-muted mb-3" />
                                                            <p className="text-muted mb-2">Arrastra una imagen aquí o haz clic para seleccionar</p>
                                                            <Form.Control
                                                                type="file"
                                                                accept="image/*"
                                                                onChange={handleFileChange}
                                                                className="d-none"
                                                                id="imageUpload"
                                                            />
                                                            <Button 
                                                                variant="outline-primary" 
                                                                onClick={() => document.getElementById('imageUpload').click()}
                                                            >
                                                                Seleccionar Imagen
                                                            </Button>
                                                        </div>
                                                    ) : (
                                                        <div className="text-center">
                                                            <img 
                                                                src={imagePreview} 
                                                                alt="Vista previa"
                                                                className="img-fluid rounded mb-3"
                                                                style={{ maxHeight: '300px', objectFit: 'cover' }}
                                                            />
                                                            <div className="d-flex justify-content-center gap-2">
                                                                <Form.Control
                                                                    type="file"
                                                                    accept="image/*"
                                                                    onChange={handleFileChange}
                                                                    className="d-none"
                                                                    id="imageChangeUpload"
                                                                />
                                                                <Button 
                                                                    variant="outline-primary" 
                                                                    size="sm"
                                                                    onClick={() => document.getElementById('imageChangeUpload').click()}
                                                                >
                                                                    <FaImage className="me-1" />
                                                                    Cambiar Imagen
                                                                </Button>
                                                                <Button 
                                                                    variant="outline-danger" 
                                                                    size="sm"
                                                                    onClick={removeImage}
                                                                >
                                                                    <FaTrash className="me-1" />
                                                                    Eliminar
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    )}
                                                    <small className="text-muted d-block mt-2">
                                                        Formatos soportados: JPEG, PNG, GIF, WebP. Tamaño máximo: 5MB
                                                    </small>
                                                </div>
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
                                                    checked={webinar.destacado}
                                                    onChange={handleChange}
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <div className="d-flex justify-content-between">
                                        <Button 
                                            variant="outline-secondary" 
                                            onClick={() => navigate('/webinars')}
                                            disabled={loading || uploadingImage}
                                        >
                                            <FaTimes className="me-2" />
                                            Cancelar
                                        </Button>
                                        <Button 
                                            variant="primary" 
                                            type="submit"
                                            disabled={loading || uploadingImage}
                                        >
                                            {loading ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                    {uploadingImage ? 'Subiendo imagen...' : 'Creando...'}
                                                </>
                                            ) : (
                                                <>
                                                    <FaSave className="me-2" />
                                                    Crear Webinar
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

export default CreateWebinarPage;