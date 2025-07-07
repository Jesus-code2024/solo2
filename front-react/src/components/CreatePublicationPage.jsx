// src/components/CreatePublicationPage.jsx
import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
    FaFileAlt, 
    FaUser, 
    FaCalendarAlt, 
    FaTags, 
    FaEye, 
    FaCheck,
    FaTimes,
    FaSpinner,
    FaBuilding,
    FaGraduationCap,
    FaGlobe
} from 'react-icons/fa';
import '../styles/CreatePublicationPage.css';

const API_URL_PUBLICACIONES = 'http://localhost:8080/api/anuncios';

function CreatePublicationPage() {
    const [titulo, setTitulo] = useState('');
    const [contenido, setContenido] = useState('');
    const [tipo, setTipo] = useState('GEN');
    const [carreraId, setCarreraId] = useState('');
    const [departamentoId, setDepartamentoId] = useState('');
    const [fechaPublicacion, setFechaPublicacion] = useState(new Date().toISOString().slice(0, 16));
    const [autorNombre, setAutorNombre] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const navigate = useNavigate();

    const tipoOptions = [
        {
            value: 'GEN',
            label: 'General',
            icon: FaGlobe,
            description: 'Anuncio para toda la comunidad',
            color: 'general'
        },
        {
            value: 'CAR',
            label: 'Carrera',
            icon: FaGraduationCap,
            description: 'Anuncio específico para una carrera',
            color: 'carrera'
        },
        {
            value: 'DEP',
            label: 'Departamento',
            icon: FaBuilding,
            description: 'Anuncio específico para un departamento',
            color: 'departamento'
        }
    ];

    useEffect(() => {
        // Obtener el nombre del usuario actual del localStorage o contexto
        const email = localStorage.getItem('emailLoggedIn');
        if (email) {
            setAutorNombre(email);
        }
    }, []);

    const getAuthHeaders = () => {
        const token = localStorage.getItem('jwtToken');
        return token ? { Authorization: `Bearer ${token}` } : {};
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);
        setLoading(true);

        // Validaciones
        if (!titulo.trim()) {
            setError('El título es requerido');
            setLoading(false);
            return;
        }

        if (!contenido.trim()) {
            setError('El contenido es requerido');
            setLoading(false);
            return;
        }

        if (tipo === 'CAR' && !carreraId) {
            setError('Debe seleccionar una carrera');
            setLoading(false);
            return;
        }

        if (tipo === 'DEP' && !departamentoId) {
            setError('Debe seleccionar un departamento');
            setLoading(false);
            return;
        }

        // Construye el objeto de la nueva publicación
        const newPublication = {
            titulo: titulo.trim(),
            contenido: contenido.trim(),
            tipo,
            fechaPublicacion: fechaPublicacion + ':00',
            autorNombre: autorNombre.trim(),
            ...(tipo === 'CAR' && { carreraId: parseInt(carreraId) }),
            ...(tipo === 'DEP' && { departamentoId: parseInt(departamentoId) }),
        };

        try {
            await axios.post(API_URL_PUBLICACIONES, newPublication, { headers: getAuthHeaders() });
            setSuccess(true);
            
            // Limpiar el formulario
            setTitulo('');
            setContenido('');
            setTipo('GEN');
            setCarreraId('');
            setDepartamentoId('');
            setFechaPublicacion(new Date().toISOString().slice(0, 16));
            
            // Redirigir después de 2 segundos
            setTimeout(() => {
                navigate('/publications');
            }, 2000);
            
        } catch (err) {
            console.error('Error al crear publicación:', err.response || err);
            if (err.response && err.response.status === 401) {
                setError('No autorizado. Por favor, inicie sesión de nuevo.');
                localStorage.removeItem('jwtToken');
                navigate('/login');
            } else if (err.response && err.response.status === 403) {
                setError('No tienes permiso para crear publicaciones.');
            } else {
                setError('Error al crear la publicación. Intente de nuevo.');
            }
        } finally {
            setLoading(false);
        }
    };

    const getCharacterCount = (text, max) => {
        const count = text.length;
        const remaining = max - count;
        let className = 'character-count';
        
        if (remaining < 20) className += ' danger';
        else if (remaining < 50) className += ' warning';
        
        return { count, remaining, className };
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getSelectedTipoInfo = () => {
        return tipoOptions.find(option => option.value === tipo);
    };

    return (
        <div className="create-publication-page">
            <Container>
                {loading && (
                    <div className="loading-overlay">
                        <div className="loading-spinner-modern">
                            <div className="spinner-modern"></div>
                            <div className="loading-text-modern">Creando publicación...</div>
                        </div>
                    </div>
                )}

                {/* Hero Section */}
                <div className="create-publication-hero">
                    <Row className="align-items-center">
                        <Col md={8}>
                            <h1><FaFileAlt style={{ marginRight: '12px' }} />Crear Nueva Publicación</h1>
                            <p>Comparte información importante con la comunidad</p>
                        </Col>
                        <Col md={4} className="text-md-end">
                            <Button 
                                variant="outline-light"
                                onClick={() => setShowPreview(!showPreview)}
                                className="preview-toggle-btn"
                            >
                                <FaEye style={{ marginRight: '8px' }} />
                                {showPreview ? 'Ocultar' : 'Vista'} Previa
                            </Button>
                        </Col>
                    </Row>
                </div>

                {error && (
                    <Alert className="alert-modern alert-danger-modern">
                        <FaTimes className="icon" />
                        {error}
                    </Alert>
                )}

                {success && (
                    <Alert className="alert-modern alert-success-modern">
                        <FaCheck className="icon" />
                        ¡Publicación creada exitosamente! Redirigiendo...
                    </Alert>
                )}

                <Row>
                    <Col lg={showPreview ? 6 : 12}>
                        <div className="create-publication-form">
                            <Form onSubmit={handleSubmit}>
                                {/* Información Básica */}
                                <div className="form-section">
                                    <h3 className="form-section-title">
                                        <FaFileAlt className="icon" />
                                        Información Básica
                                    </h3>
                                    
                                    <div className="form-group-modern">
                                        <Form.Label className="form-label-modern">
                                            <FaFileAlt className="icon" />
                                            Título de la Publicación
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Ingrese un título descriptivo"
                                            value={titulo}
                                            onChange={(e) => setTitulo(e.target.value)}
                                            className="form-control-modern"
                                            maxLength={200}
                                            required
                                        />
                                        <div className={getCharacterCount(titulo, 200).className}>
                                            {getCharacterCount(titulo, 200).count}/200 caracteres
                                        </div>
                                    </div>

                                    <div className="form-group-modern">
                                        <Form.Label className="form-label-modern">
                                            <FaFileAlt className="icon" />
                                            Contenido
                                        </Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={6}
                                            placeholder="Escriba el contenido de la publicación..."
                                            value={contenido}
                                            onChange={(e) => setContenido(e.target.value)}
                                            className="form-control-modern form-textarea-modern"
                                            maxLength={1000}
                                            required
                                        />
                                        <div className={getCharacterCount(contenido, 1000).className}>
                                            {getCharacterCount(contenido, 1000).count}/1000 caracteres
                                        </div>
                                        <div className="help-text">
                                            Proporcione información clara y concisa sobre la publicación
                                        </div>
                                    </div>
                                </div>

                                {/* Tipo de Publicación */}
                                <div className="form-section">
                                    <h3 className="form-section-title">
                                        <FaTags className="icon" />
                                        Tipo de Publicación
                                    </h3>
                                    
                                    <div className="type-selection-cards">
                                        {tipoOptions.map((option) => {
                                            const IconComponent = option.icon;
                                            return (
                                                <div
                                                    key={option.value}
                                                    className={`type-card ${tipo === option.value ? 'active' : ''}`}
                                                    onClick={() => setTipo(option.value)}
                                                >
                                                    <IconComponent className="type-card-icon" />
                                                    <div className="type-card-title">{option.label}</div>
                                                    <div className="type-card-description">{option.description}</div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Campos condicionales */}
                                    {tipo === 'CAR' && (
                                        <div className="conditional-field">
                                            <Form.Label className="form-label-modern">
                                                <FaGraduationCap className="icon" />
                                                ID de Carrera
                                            </Form.Label>
                                            <Form.Control
                                                type="number"
                                                placeholder="Ingrese el ID de la carrera"
                                                value={carreraId}
                                                onChange={(e) => setCarreraId(e.target.value)}
                                                className="form-control-modern"
                                                required
                                            />
                                            <div className="help-text">
                                                Especifique el ID de la carrera para la cual está dirigido este anuncio
                                            </div>
                                        </div>
                                    )}

                                    {tipo === 'DEP' && (
                                        <div className="conditional-field">
                                            <Form.Label className="form-label-modern">
                                                <FaBuilding className="icon" />
                                                ID de Departamento
                                            </Form.Label>
                                            <Form.Control
                                                type="number"
                                                placeholder="Ingrese el ID del departamento"
                                                value={departamentoId}
                                                onChange={(e) => setDepartamentoId(e.target.value)}
                                                className="form-control-modern"
                                                required
                                            />
                                            <div className="help-text">
                                                Especifique el ID del departamento para el cual está dirigido este anuncio
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Detalles de Publicación */}
                                <div className="form-section">
                                    <h3 className="form-section-title">
                                        <FaUser className="icon" />
                                        Detalles de Publicación
                                    </h3>
                                    
                                    <Row>
                                        <Col md={6}>
                                            <div className="form-group-modern">
                                                <Form.Label className="form-label-modern">
                                                    <FaCalendarAlt className="icon" />
                                                    Fecha de Publicación
                                                </Form.Label>
                                                <Form.Control
                                                    type="datetime-local"
                                                    value={fechaPublicacion}
                                                    onChange={(e) => setFechaPublicacion(e.target.value)}
                                                    className="form-control-modern"
                                                    required
                                                />
                                            </div>
                                        </Col>
                                        <Col md={6}>
                                            <div className="form-group-modern">
                                                <Form.Label className="form-label-modern">
                                                    <FaUser className="icon" />
                                                    Autor
                                                </Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Nombre del autor"
                                                    value={autorNombre}
                                                    onChange={(e) => setAutorNombre(e.target.value)}
                                                    className="form-control-modern"
                                                    required
                                                />
                                            </div>
                                        </Col>
                                    </Row>
                                </div>

                                {/* Botones de Acción */}
                                <div className="form-actions">
                                    <Button
                                        type="button"
                                        className="btn-secondary-modern"
                                        onClick={() => navigate('/publications')}
                                        disabled={loading}
                                    >
                                        <FaTimes style={{ marginRight: '8px' }} />
                                        Cancelar
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="btn-primary-modern"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <FaSpinner style={{ marginRight: '8px' }} className="fa-spin" />
                                                Creando...
                                            </>
                                        ) : (
                                            <>
                                                <FaCheck style={{ marginRight: '8px' }} />
                                                Crear Publicación
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </Form>
                        </div>
                    </Col>

                    {/* Vista Previa */}
                    {showPreview && (
                        <Col lg={6}>
                            <div className="preview-section">
                                <h3 className="preview-title">
                                    <FaEye className="icon" />
                                    Vista Previa
                                </h3>
                                <div className="preview-card">
                                    <div className={`preview-card-type ${getSelectedTipoInfo()?.color}`}>
                                        {getSelectedTipoInfo()?.label}
                                    </div>
                                    <h4 className="preview-card-title">
                                        {titulo || 'Título de la publicación'}
                                    </h4>
                                    <div className="preview-card-content">
                                        {contenido || 'El contenido de la publicación aparecerá aquí...'}
                                    </div>
                                    <div className="preview-card-meta">
                                        <span>
                                            <FaCalendarAlt style={{ marginRight: '4px' }} />
                                            {formatDate(fechaPublicacion)}
                                        </span>
                                        <span>
                                            <FaUser style={{ marginRight: '4px' }} />
                                            {autorNombre || 'Autor'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    )}
                </Row>
            </Container>
        </div>
    );
}

export default CreatePublicationPage;