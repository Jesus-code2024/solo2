import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Alert, Row, Col, Card } from 'react-bootstrap';
import { FaVideo, FaCalendarAlt, FaUser, FaLink, FaImage, FaSave, FaTimes } from 'react-icons/fa';
import '../styles/CreateWebinarPage.css';

const API_URL_WEBINARS = 'http://localhost:8080/api/webinars';

function CreateWebinarPage() {
    const [titulo, setTitulo] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [fecha, setFecha] = useState('');
    const [expositor, setExpositor] = useState('');
    const [enlace, setEnlace] = useState('');
    const [selectedFile, setSelectedFile] = useState(null); // <-- Nuevo estado para el archivo
    const [destacado, setDestacado] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const getAuthHeaders = () => {
        const token = localStorage.getItem('jwtToken');
        return token ? { Authorization: `Bearer ${token}` } : {};
    };

    // Nuevo manejador para el input de tipo 'file'
    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]); // Guarda el primer archivo seleccionado
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);
        setLoading(true);

        const formData = new FormData(); // <-- Usamos FormData para enviar archivos
        formData.append('titulo', titulo);
        formData.append('descripcion', descripcion);
        formData.append('fecha', fecha);
        formData.append('expositor', expositor);
        formData.append('enlace', enlace);
        formData.append('destacado', destacado);

        if (selectedFile) {
            formData.append('file', selectedFile); // <-- ¡Importante! Aquí se añade el archivo
        }

        try {
            const headers = getAuthHeaders();
            // No establecemos Content-Type a 'multipart/form-data' explícitamente.
            // Axios y el navegador lo harán automáticamente al usar FormData.
            // Si lo estableces manualmente, puede causar problemas con los límites de la parte.

            await axios.post(API_URL_WEBINARS, formData, { headers }); // Enviamos formData
            setSuccess(true);

            // Marcar que se creó un webinar para refrescar la página de webinars
            sessionStorage.setItem('webinarCreated', 'true');

            // También refrescar el perfil si viene de ahí
            const fromProfile = sessionStorage.getItem('createWebinarFromProfile');
            if (fromProfile) {
                sessionStorage.setItem('webinarCreatedFromProfile', 'true');
                sessionStorage.removeItem('createWebinarFromProfile');
            }

            setTimeout(() => {
                navigate(fromProfile ? '/perfil' : '/webinars');
            }, 1500);
        } catch (err) {
            console.error('Error al crear el webinar:', err);
            setError('No se pudo crear el webinar. Por favor, intente de nuevo.');
            if (err.response && err.response.status === 401) {
                localStorage.removeItem('jwtToken');
                navigate('/login');
            } else if (err.response && err.response.data && err.response.data.message) {
                 setError(`Error: ${err.response.data.message}`);
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
                                                    value={titulo}
                                                    onChange={(e) => setTitulo(e.target.value)}
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
                                                    value={fecha}
                                                    onChange={(e) => setFecha(e.target.value)}
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
                                                    value={expositor}
                                                    onChange={(e) => setExpositor(e.target.value)}
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
                                                    value={descripcion}
                                                    onChange={(e) => setDescripcion(e.target.value)}
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
                                                    value={enlace}
                                                    onChange={(e) => setEnlace(e.target.value)}
                                                    placeholder="https://ejemplo.com/webinar"
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label className="fw-bold">
                                                    <FaImage className="me-2" />
                                                    Subir Imagen
                                                </Form.Label>
                                                <Form.Control
                                                    type="file" // <-- ¡Cambiado a tipo "file"!
                                                    accept="image/*" // Permite solo archivos de imagen
                                                    onChange={handleFileChange} // <-- Nuevo manejador
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
                                                    label="Marcar como webinar destacado"
                                                    checked={destacado}
                                                    onChange={(e) => setDestacado(e.target.checked)}
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    {/* Vista previa de imagen (ahora para el archivo seleccionado) */}
                                    {selectedFile && (
                                        <Row>
                                            <Col md={12}>
                                                <div className="mb-4">
                                                    <h6 className="fw-bold">Vista previa de imagen:</h6>
                                                    <img
                                                        src={URL.createObjectURL(selectedFile)} // Crea una URL temporal para la vista previa
                                                        alt="Vista previa"
                                                        className="img-fluid rounded"
                                                        style={{ maxHeight: '200px', objectFit: 'cover' }}
                                                        onLoad={() => URL.revokeObjectURL(URL.createObjectURL(selectedFile))} // Libera la URL cuando la imagen cargue
                                                    />
                                                </div>
                                            </Col>
                                        </Row>
                                    )}

                                    <div className="d-flex justify-content-between">
                                        <Button
                                            variant="outline-secondary"
                                            onClick={() => navigate('/webinars')}
                                            disabled={loading}
                                        >
                                            <FaTimes className="me-2" />
                                            Cancelar
                                        </Button>
                                        <Button
                                            variant="primary"
                                            type="submit"
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                    Creando...
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