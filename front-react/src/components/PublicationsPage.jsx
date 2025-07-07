// src/components/PublicationsPage.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Row,
    Col,
    Button,
    Form,
    Nav,
    Alert,
    Modal
} from 'react-bootstrap';
import { 
    FaEdit, 
    FaTrash, 
    FaSearch, 
    FaPlus, 
    FaEye, 
    FaCalendarAlt,
    FaUser,
    FaFileAlt,
    FaTags,
    FaFilter
} from 'react-icons/fa';
import '../styles/PublicationsPage.css';

// URL base de tu backend de Spring Boot para los anuncios/publicaciones
const API_URL_PUBLICACIONES = 'http://localhost:8080/api/anuncios';

function PublicationsPage() {
    const [publications, setPublications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('all');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [publicationToDelete, setPublicationToDelete] = useState(null);
    const [stats, setStats] = useState({
        total: 0,
        general: 0,
        carrera: 0,
        departamento: 0
    });
    const navigate = useNavigate();

    const getAuthHeaders = () => {
        const token = localStorage.getItem('jwtToken'); 
        return token ? { Authorization: `Bearer ${token}` } : {};
    };

    const mapTipoAnuncioToDisplay = (tipoEnum) => {
        switch (tipoEnum) {
            case 'GEN':
                return { label: 'General', class: 'general' };
            case 'CAR':
                return { label: 'Carrera', class: 'carrera' };
            case 'DEP':
                return { label: 'Departamento', class: 'departamento' };
            default:
                return { label: tipoEnum, class: 'general' };
        }
    };

    const calculateStats = (pubs) => {
        const stats = {
            total: pubs.length,
            general: pubs.filter(p => p.tipo === 'GEN').length,
            carrera: pubs.filter(p => p.tipo === 'CAR').length,
            departamento: pubs.filter(p => p.tipo === 'DEP').length
        };
        setStats(stats);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getAuthorInitials = (author) => {
        if (!author) return 'U';
        if (author.firstName && author.lastName) {
            return `${author.firstName[0]}${author.lastName[0]}`.toUpperCase();
        }
        if (author.username) {
            return author.username.substring(0, 2).toUpperCase();
        }
        if (author.email) {
            return author.email.substring(0, 2).toUpperCase();
        }
        return 'U';
    };

    const getAuthorName = (author) => {
        if (!author) return 'Usuario Desconocido';
        if (author.firstName && author.lastName) {
            return `${author.firstName} ${author.lastName}`;
        }
        return author.username || author.email || 'Usuario Desconocido';
    };

    // Función para obtener las publicaciones del backend
    const fetchPublications = async (type = 'all') => {
        setLoading(true);
        setError(null);
        let url = API_URL_PUBLICACIONES;

        // Construye la URL para filtrar por tipo, usando los nombres exactos de tu enum de Java
        if (type !== 'all') {
            url = `${API_URL_PUBLICACIONES}/tipo/${type}`;
        }

        try {
            // Incluir el token en los headers de la petición
            const response = await axios.get(url, { headers: getAuthHeaders() });
            setPublications(response.data);
            calculateStats(response.data);
        } catch (err) {
            console.error('Error al cargar las publicaciones:', err);
            setError('No se pudieron cargar las publicaciones. Por favor, intente de nuevo.');
            if (err.response && err.response.status === 401) {
                // Redirigir al login si no está autorizado (sesión expirada, token inválido)
                localStorage.removeItem('jwtToken'); // Limpiar el token inválido
                navigate('/login');
            } else if (err.response && err.response.status === 403) {
                // Si el usuario no tiene los roles necesarios para el endpoint
                setError('No tienes permiso para ver estas publicaciones.');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPublications(activeTab); 
    }, [activeTab]); 
    // Manejador del cambio de pestaña
    const handleTabSelect = (selectedKey) => {
        setActiveTab(selectedKey);
    };

    const filteredPublications = publications.filter(pub =>
        pub.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (pub.contenido && pub.contenido.toLowerCase().includes(searchTerm.toLowerCase())) || // Usar 'contenido'
        (pub.autor && ( // <-- Inicio de la corrección para la búsqueda del autor
            (pub.autor.firstName && pub.autor.firstName.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (pub.autor.lastName && pub.autor.lastName.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (pub.autor.username && pub.autor.username.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (pub.autor.email && pub.autor.email.toLowerCase().includes(searchTerm.toLowerCase()))
        )) 
    );

    const handleCreatePublication = () => {
        console.log('Navegar a la página de creación de publicación');
        navigate('/publications/new'); 
    };

    const handleEditPublication = (id) => {
        console.log('Editar publicación con ID:', id);
        navigate(`/publications/edit/${id}`); 
    };

    const handleDeletePublication = (publication) => {
        setPublicationToDelete(publication);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!publicationToDelete) return;
        
        try {
            await axios.delete(`${API_URL_PUBLICACIONES}/${publicationToDelete.id}`, { 
                headers: getAuthHeaders() 
            });
            console.log('Publicación eliminada con ID:', publicationToDelete.id);
            fetchPublications(activeTab);
            setShowDeleteModal(false);
            setPublicationToDelete(null);
        } catch (err) {
            console.error('Error al eliminar publicación:', err);
            setError('No se pudo eliminar la publicación.');
            if (err.response && err.response.status === 401) {
                localStorage.removeItem('jwtToken');
                navigate('/login');
            } else if (err.response && err.response.status === 403) {
                setError('No tienes permiso para eliminar esta publicación.');
            } else if (err.response && err.response.status === 400 && err.response.data.includes("No tienes permiso para eliminar este anuncio")) {
                setError(err.response.data);
            }
        }
    };

    if (loading) {
        return (
            <div className="publications-page">
                <Container>
                    <div className="loading-spinner">
                        <div className="spinner-custom"></div>
                        <div className="loading-text">Cargando publicaciones...</div>
                    </div>
                </Container>
            </div>
        );
    }

    return (
        <div className="publications-page">
            <Container fluid>
                {error && (
                    <Alert variant="danger" className="error-alert">
                        <strong>Error:</strong> {error}
                    </Alert>
                )}

                {/* Hero Section */}
                <div className="publications-hero">
                    <Container>
                        <Row className="align-items-center">
                            <Col md={8}>
                                <h1><FaFileAlt className="me-3" />Publicaciones</h1>
                                <p>Gestiona y visualiza todas las publicaciones de la plataforma</p>
                            </Col>
                            <Col md={4} className="text-md-end">
                                <Button 
                                    className="create-publication-btn"
                                    onClick={handleCreatePublication}
                                    size="lg"
                                >
                                    <FaPlus className="me-2" />
                                    Crear Publicación
                                </Button>
                            </Col>
                        </Row>
                    </Container>
                </div>

                {/* Statistics */}
                <div className="stats-container">
                    <div className="stat-card">
                        <div className="stat-number">{stats.total}</div>
                        <div className="stat-label">Total</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-number">{stats.general}</div>
                        <div className="stat-label">Generales</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-number">{stats.carrera}</div>
                        <div className="stat-label">Carreras</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-number">{stats.departamento}</div>
                        <div className="stat-label">Departamentos</div>
                    </div>
                </div>

                {/* Filters */}
                <div className="publications-filters">
                    <Row>
                        <Col md={8}>
                            <Nav variant="tabs" className="filter-tabs" activeKey={activeTab} onSelect={handleTabSelect}>
                                <Nav.Item>
                                    <Nav.Link eventKey="all">
                                        <FaTags className="me-2" />
                                        Todos
                                    </Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="GEN">
                                        <FaFileAlt className="me-2" />
                                        Generales
                                    </Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="CAR">
                                        <FaUser className="me-2" />
                                        Carreras
                                    </Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="DEP">
                                        <FaFilter className="me-2" />
                                        Departamentos
                                    </Nav.Link>
                                </Nav.Item>
                            </Nav>
                        </Col>
                        <Col md={4}>
                            <div className="search-container">
                                <Form.Control
                                    type="text"
                                    placeholder="Buscar publicaciones..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="search-input"
                                />
                                <FaSearch className="search-icon" />
                            </div>
                        </Col>
                    </Row>
                </div>

                {/* Publications Grid */}
                {filteredPublications.length > 0 ? (
                    <div className="publications-grid">
                        {filteredPublications.map((pub) => {
                            const typeInfo = mapTipoAnuncioToDisplay(pub.tipo);
                            return (
                                <div key={pub.id} className="publication-card">
                                    <div className="publication-card-header">
                                        <div className={`publication-type-badge ${typeInfo.class}`}>
                                            {typeInfo.label}
                                        </div>
                                        <h3 className="publication-title">{pub.titulo}</h3>
                                        <div className="publication-date">
                                            <FaCalendarAlt className="me-2" />
                                            {pub.fechaPublicacion ? formatDate(pub.fechaPublicacion) : 'Fecha no disponible'}
                                        </div>
                                    </div>
                                    <div className="publication-card-body">
                                        <div className="publication-content">
                                            {pub.contenido || 'Sin contenido disponible'}
                                        </div>
                                        <div className="publication-author">
                                            <div className="author-avatar">
                                                {getAuthorInitials(pub.autor)}
                                            </div>
                                            <div className="author-info">
                                                <div className="author-name">
                                                    {getAuthorName(pub.autor)}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="publication-actions">
                                            <Button 
                                                className="action-btn view"
                                                onClick={() => navigate(`/publications/${pub.id}`)}
                                            >
                                                <FaEye className="me-1" />
                                                Ver
                                            </Button>
                                            <Button 
                                                className="action-btn edit"
                                                onClick={() => handleEditPublication(pub.id)}
                                            >
                                                <FaEdit className="me-1" />
                                                Editar
                                            </Button>
                                            <Button 
                                                className="action-btn delete"
                                                onClick={() => handleDeletePublication(pub)}
                                            >
                                                <FaTrash className="me-1" />
                                                Eliminar
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="empty-state">
                        <FaFileAlt className="empty-state-icon" />
                        <h3>No se encontraron publicaciones</h3>
                        <p>No hay publicaciones que coincidan con tu búsqueda o filtros.</p>
                        <Button 
                            className="create-publication-btn"
                            onClick={handleCreatePublication}
                        >
                            <FaPlus className="me-2" />
                            Crear Primera Publicación
                        </Button>
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                <Modal 
                    show={showDeleteModal} 
                    onHide={() => setShowDeleteModal(false)}
                    centered
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Confirmar Eliminación</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>¿Estás seguro de que quieres eliminar la publicación?</p>
                        {publicationToDelete && (
                            <div style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
                                <strong>{publicationToDelete.titulo}</strong>
                                <p className="text-muted mb-0">
                                    {publicationToDelete.contenido ? 
                                        publicationToDelete.contenido.substring(0, 100) + '...' : 
                                        'Sin contenido'
                                    }
                                </p>
                            </div>
                        )}
                        <p className="text-danger mt-2">
                            <strong>Esta acción no se puede deshacer.</strong>
                        </p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button 
                            variant="secondary" 
                            onClick={() => setShowDeleteModal(false)}
                        >
                            Cancelar
                        </Button>
                        <Button 
                            variant="danger" 
                            onClick={confirmDelete}
                        >
                            <FaTrash className="me-2" />
                            Eliminar
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Container>
        </div>
    );
}

export default PublicationsPage;