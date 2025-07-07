// src/components/WebinarsPage.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Alert, Form, Button, Modal, Card, Badge, Toast, ToastContainer } from 'react-bootstrap';
import { 
    FaSearch, 
    FaVideo, 
    FaCalendarAlt, 
    FaUser, 
    FaLink,
    FaFilter,
    FaTimes,
    FaHeart,
    FaShare,
    FaClock,
    FaUsers,
    FaChevronRight,
    FaBookmark,
    FaPlay,
    FaInfoCircle,
    FaPlus,
    FaEdit,
    FaTrash,
    FaExternalLinkAlt,
    FaLaptop,
    FaMicrophone,
    FaEye,
    FaSync
} from 'react-icons/fa';
import '../styles/WebinarsPage.css';

const API_URL_WEBINARS = 'http://localhost:8080/api/webinars'; 
const BASE_URL = 'http://localhost:8080'; 

const formatLocalDateTime = (dateTimeString) => {
    if (!dateTimeString) return 'N/A';
    const date = new Date(dateTimeString);
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
    return date.toLocaleDateString('es-ES', options);
};

function WebinarsPage() {
    const [webinars, setWebinars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedWebinarType, setSelectedWebinarType] = useState('all');
    const [sortBy, setSortBy] = useState('fecha');
    const [showFilters, setShowFilters] = useState(false);
    const [selectedWebinar, setSelectedWebinar] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [favorites, setFavorites] = useState([]);
    const [viewMode, setViewMode] = useState('grid');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [webinarToDelete, setWebinarToDelete] = useState(null);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const navigate = useNavigate();

    const getAuthHeaders = () => {
        const token = localStorage.getItem('jwtToken');
        return token ? { Authorization: `Bearer ${token}` } : {};
    };

    const fetchWebinars = async () => {
        setLoading(true);
        setError(null);
        try {
            console.log('Fetching webinars from:', API_URL_WEBINARS);
            const response = await axios.get(API_URL_WEBINARS, { headers: getAuthHeaders() });
            console.log('Webinars response:', response.data);
            setWebinars(response.data);
        } catch (err) {
            console.error('Error al cargar los webinars:', err);
            setError('No se pudieron cargar los webinars. Por favor, intente de nuevo.');
            if (err.response && err.response.status === 401) {
                localStorage.removeItem('jwtToken');
                navigate('/login');
            } else if (err.response && err.response.status === 403) {
                setError('No tienes permiso para ver los webinars.');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWebinars();
        // Cargar favoritos del localStorage
        const savedFavorites = localStorage.getItem('webinarFavorites');
        if (savedFavorites) {
            setFavorites(JSON.parse(savedFavorites));
        }
    }, []);

    // Agregar un efecto para refrescar cuando se vuelve a la página
    useEffect(() => {
        const handleFocus = () => {
            fetchWebinars();
        };
        
        window.addEventListener('focus', handleFocus);
        return () => window.removeEventListener('focus', handleFocus);
    }, []);

    // Refrescar cuando se navega a esta página
    useEffect(() => {
        const unsubscribe = () => {
            fetchWebinars();
        };
        
        // Escuchar cambios en la navegación
        window.addEventListener('popstate', unsubscribe);
        return () => window.removeEventListener('popstate', unsubscribe);
    }, []);

    // Detectar si se debe refrescar por creación/edición de webinar
    useEffect(() => {
        const shouldRefresh = sessionStorage.getItem('webinarCreated') || sessionStorage.getItem('webinarUpdated');
        if (shouldRefresh) {
            fetchWebinars();
            if (sessionStorage.getItem('webinarCreated')) {
                setToastMessage('¡Webinar creado exitosamente!');
                setShowToast(true);
                sessionStorage.removeItem('webinarCreated');
            }
            if (sessionStorage.getItem('webinarUpdated')) {
                setToastMessage('¡Webinar actualizado exitosamente!');
                setShowToast(true);
                sessionStorage.removeItem('webinarUpdated');
            }
        }
    }, []);

    // Monitorear cambios en sessionStorage
    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === 'webinarCreated' || e.key === 'webinarUpdated') {
                fetchWebinars();
                sessionStorage.removeItem('webinarCreated');
                sessionStorage.removeItem('webinarUpdated');
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const handleCreateWebinarClick = () => {
        navigate('/webinar/new'); 
    };

    // Función para refrescar manualmente los webinars
    const handleRefreshWebinars = () => {
        fetchWebinars();
    };

    // Función de diagnóstico
    const runDiagnostic = () => {
        console.log('=== DIAGNÓSTICO DE WEBINARS ===');
        console.log('Token JWT:', localStorage.getItem('jwtToken') ? 'Presente' : 'Ausente');
        console.log('URL API:', API_URL_WEBINARS);
        console.log('Total webinars cargados:', webinars.length);
        console.log('Webinars:', webinars);
        console.log('Filtros activos:', { selectedWebinarType, searchTerm, sortBy });
        console.log('Webinars filtrados:', sortedAndFilteredWebinars.length);
        console.log('Estado de carga:', { loading, error });
        
        // Verificar conexión a la API
        axios.get(API_URL_WEBINARS, { headers: getAuthHeaders() })
            .then(response => {
                console.log('✅ Conexión API exitosa. Datos recibidos:', response.data.length, 'webinars');
                console.log('Datos completos:', response.data);
            })
            .catch(err => {
                console.log('❌ Error en conexión API:', err);
                console.log('Status:', err.response?.status);
                console.log('Data:', err.response?.data);
            });
    };

    const handleEditClick = (id) => {
        navigate(`/edit-webinar/${id}`); 
    };

    const handleDeleteClick = (webinar) => {
        setWebinarToDelete(webinar);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (webinarToDelete) {
            try {
                await axios.delete(`${API_URL_WEBINARS}/${webinarToDelete.id}`, { headers: getAuthHeaders() });
                setShowDeleteModal(false);
                setWebinarToDelete(null);
                fetchWebinars();
                setToastMessage('Webinar eliminado con éxito.');
                setShowToast(true);
            } catch (err) {
                console.error('Error al eliminar el webinar:', err);
                if (err.response && err.response.status === 403) {
                    alert('No tienes permiso para eliminar este webinar (solo el autor puede).');
                } else {
                    alert('Hubo un error al eliminar el webinar. Por favor, intente de nuevo.');
                }
            }
        }
    };

    const handleViewDetailsClick = (webinar) => {
        setSelectedWebinar(webinar);
        setShowModal(true);
    };

    const toggleFavorite = (webinarId) => {
        const newFavorites = favorites.includes(webinarId)
            ? favorites.filter(id => id !== webinarId)
            : [...favorites, webinarId];
        
        setFavorites(newFavorites);
        localStorage.setItem('webinarFavorites', JSON.stringify(newFavorites));
    };

    const shareWebinar = (webinar) => {
        if (navigator.share) {
            navigator.share({
                title: webinar.titulo,
                text: webinar.descripcion,
                url: webinar.enlace || window.location.href
            });
        } else {
            // Fallback para navegadores que no soportan Web Share API
            navigator.clipboard.writeText(webinar.enlace || window.location.href);
            alert('Enlace copiado al portapapeles');
        }
    };

    const getWebinarStatus = (webinar) => {
        const now = new Date();
        const webinarDate = new Date(webinar.fecha);
        const hoursDiff = (webinarDate - now) / (1000 * 60 * 60);
        
        if (hoursDiff > 24) return 'upcoming';
        if (hoursDiff > 0) return 'soon';
        if (hoursDiff > -2) return 'live';
        return 'finished';
    };

    const getStatusColor = (status) => {
        const colors = {
            'upcoming': 'primary',
            'soon': 'warning',
            'live': 'success',
            'finished': 'secondary'
        };
        return colors[status] || 'secondary';
    };

    const getStatusText = (status) => {
        const texts = {
            'upcoming': 'Próximo',
            'soon': 'Pronto',
            'live': 'En Vivo',
            'finished': 'Finalizado'
        };
        return texts[status] || 'Desconocido';
    };

    const sortedAndFilteredWebinars = webinars
        .filter(webinar => {
            const matchesSearch = webinar.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (webinar.descripcion && webinar.descripcion.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (webinar.expositor && webinar.expositor.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (webinar.autor && webinar.autor.username.toLowerCase().includes(searchTerm.toLowerCase()));
            
            const matchesType = selectedWebinarType === 'all' || 
                (selectedWebinarType === 'upcoming' && getWebinarStatus(webinar) === 'upcoming') ||
                (selectedWebinarType === 'live' && getWebinarStatus(webinar) === 'live') ||
                (selectedWebinarType === 'finished' && getWebinarStatus(webinar) === 'finished') ||
                (selectedWebinarType === 'favorites' && favorites.includes(webinar.id));
            
            return matchesSearch && matchesType;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'fecha':
                    return new Date(a.fecha) - new Date(b.fecha);
                case 'titulo':
                    return a.titulo.localeCompare(b.titulo);
                case 'expositor':
                    return (a.expositor || '').localeCompare(b.expositor || '');
                default:
                    return 0;
            }
        });

    const filteredWebinars = webinars.filter(webinar =>
        webinar.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (webinar.descripcion && webinar.descripcion.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (webinar.expositor && webinar.expositor.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (webinar.autor && webinar.autor.username.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (loading) {
        return (
            <div className="webinars-page">
                <Container>
                    <div className="loading-section">
                        <div className="loading-spinner"></div>
                        <div className="loading-text">Cargando webinars...</div>
                    </div>
                </Container>
            </div>
        );
    }

    if (error) {
        return (
            <div className="webinars-page">
                <Container>
                    <div className="error-section">
                        <h3>Error al cargar webinars</h3>
                        <p>{error}</p>
                    </div>
                </Container>
            </div>
        );
    }

    return (
        <div className="webinars-page">
            <Container>
                {/* Hero Section */}
                <div className="webinars-hero">
                    <Row className="align-items-center">
                        <Col md={8}>
                            <h1><FaVideo style={{ marginRight: '12px' }} />Webinars y Conferencias</h1>
                            <p>Participa en webinars educativos y conferencias en línea</p>
                        </Col>
                        <Col md={4} className="text-md-end">
                            {/* Eliminar o comentar este botón: */}
                            {/*
                            <Button 
                                variant="outline-light"
                                onClick={handleCreateWebinarClick}
                                className="create-webinar-btn"
                            >
                                <FaPlus style={{ marginRight: '8px' }} />
                                Crear Webinar
                            </Button>
                            */}
                            {/* Eliminar o comentar este botón: */}
                            {/*
                            <Button 
                                variant="outline-light"
                                onClick={() => setShowFilters(!showFilters)}
                                className="filters-btn"
                            >
                                <FaFilter style={{ marginRight: '8px' }} />
                                Filtros
                            </Button>
                            */}
                        </Col>
                    </Row>
                </div>

                {/* Statistics */}
                <div className="webinars-stats">
                    <div className="stat-card">
                        <div className="stat-number">{webinars.length}</div>
                        <div className="stat-label">Total Webinars</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-number">
                            {webinars.filter(w => getWebinarStatus(w) === 'upcoming').length}
                        </div>
                        <div className="stat-label">Próximos</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-number">
                            {webinars.filter(w => getWebinarStatus(w) === 'live').length}
                        </div>
                        <div className="stat-label">En Vivo</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-number">{favorites.length}</div>
                        <div className="stat-label">Favoritos</div>
                    </div>
                </div>


                {/* Search and Filters */}
                {/* Si no quieres los filtros, puedes comentar o eliminar toda la sección `search-section` */}
                <div className="search-section">
                    <div className="search-container">
                        <Form.Control
                            type="text"
                            placeholder="Buscar por título, descripción, expositor o autor..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                        <FaSearch className="search-icon" />
                    </div>
                    
                    {/* Botones de acción */}
                    <div className="action-buttons" style={{ marginTop: '15px', textAlign: 'center' }}>
                        <Button 
                            variant="primary" 
                            onClick={handleCreateWebinarClick}
                            style={{ marginRight: '10px' }}
                        >
                            <FaPlus style={{ marginRight: '8px' }} />
                            Crear Webinar
                        </Button>
                        <Button 
                            variant="outline-secondary" 
                            onClick={handleRefreshWebinars}
                            disabled={loading}
                            style={{ marginRight: '10px' }}
                        >
                            <FaSync className={loading ? 'fa-spin' : ''} style={{ marginRight: '8px' }} />
                            {loading ? 'Refrescando...' : 'Refrescar'}
                        </Button>
                        <Button 
                            variant="outline-info" 
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            <FaFilter style={{ marginRight: '8px' }} />
                            {showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'}
                        </Button>
                    </div>

                    {/* También puedes comentar o eliminar completamente esta sección `filters-section` si no quieres que aparezca el formulario de filtros al hacer clic */}
                    {showFilters && (
                        <div className="filters-section">
                            <Row>
                                <Col md={4}>
                                    <Form.Select 
                                        value={selectedWebinarType} 
                                        onChange={(e) => setSelectedWebinarType(e.target.value)}
                                        className="filter-select"
                                    >
                                        <option value="all">Todos los webinars</option>
                                        <option value="upcoming">Próximos</option>
                                        <option value="live">En vivo</option>
                                        <option value="finished">Finalizados</option>
                                        <option value="favorites">Favoritos</option>
                                    </Form.Select>
                                </Col>
                                <Col md={4}>
                                    <Form.Select 
                                        value={sortBy} 
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="filter-select"
                                    >
                                        <option value="fecha">Ordenar por fecha</option>
                                        <option value="titulo">Ordenar por título</option>
                                        <option value="expositor">Ordenar por expositor</option>
                                    </Form.Select>
                                </Col>
                                <Col md={4}>
                                    <div className="view-mode-toggle">
                                        <Button 
                                            variant={viewMode === 'grid' ? 'primary' : 'outline-primary'}
                                            onClick={() => setViewMode('grid')}
                                            style={{ marginRight: '8px' }}
                                        >
                                            Grid
                                        </Button>
                                        <Button 
                                            variant={viewMode === 'list' ? 'primary' : 'outline-primary'}
                                            onClick={() => setViewMode('list')}
                                        >
                                            Lista
                                        </Button>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    )}
                </div>

                {/* Webinars Grid/List */}
                {sortedAndFilteredWebinars.length === 0 ? (
                    <div className="empty-state">
                        <FaVideo className="empty-state-icon" />
                        <h3>
                            {webinars.length === 0 
                                ? 'No hay webinars disponibles'
                                : 'No se encontraron webinars'
                            }
                        </h3>
                        <p>
                            {webinars.length === 0 
                                ? 'Parece que aún no hay webinars creados. ¡Sé el primero en crear uno!'
                                : 'No hay webinars que coincidan con tu búsqueda o filtros.'
                            }
                        </p>
                        <Button 
                            variant="primary" 
                            onClick={handleCreateWebinarClick}
                            className="btn-primary-modern"
                        >
                            <FaPlus style={{ marginRight: '8px' }} />
                            {webinars.length === 0 ? 'Crear Primer Webinar' : 'Crear Nuevo Webinar'}
                        </Button>
                        {webinars.length > 0 && (
                            <Button 
                                variant="outline-secondary" 
                                onClick={() => {
                                    setSearchTerm('');
                                    setSelectedWebinarType('all');
                                }}
                                className="btn-secondary-modern"
                                style={{ marginLeft: '10px' }}
                            >
                                Limpiar Filtros
                            </Button>
                        )}
                    </div>
                ) : (
                    <div className={`webinars-container ${viewMode}`}>
                        {sortedAndFilteredWebinars.map((webinar) => (
                            <Card key={webinar.id} className="webinar-card">
                                <div className="webinar-card-header">
                                    <div className="webinar-status-badge">
                                        <Badge bg={getStatusColor(getWebinarStatus(webinar))}>
                                            {getStatusText(getWebinarStatus(webinar))}
                                        </Badge>
                                    </div>
                                    <div className="webinar-actions-quick">
                                        <Button
                                            variant="link"
                                            onClick={() => toggleFavorite(webinar.id)}
                                            className={`favorite-btn ${favorites.includes(webinar.id) ? 'active' : ''}`}
                                        >
                                            <FaHeart />
                                        </Button>
                                        <Button
                                            variant="link"
                                            onClick={() => shareWebinar(webinar)}
                                            className="share-btn"
                                        >
                                            <FaShare />
                                        </Button>
                                    </div>
                                </div>
                                <Card.Body className="webinar-card-body">
                                    {webinar.imagen ? (
                                        <div className="webinar-image-container">
                                            <img 
                                                src={webinar.imagen.startsWith('http') ? webinar.imagen : `${BASE_URL}${webinar.imagen}`}
                                                alt={webinar.titulo}
                                                className="webinar-image"
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    e.target.nextSibling.style.display = 'flex';
                                                }}
                                            />
                                            <div className="webinar-icon-container" style={{ display: 'none' }}>
                                                <FaVideo className="webinar-icon" />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="webinar-icon-container">
                                            <FaVideo className="webinar-icon" />
                                        </div>
                                    )}
                                    <Card.Title className="webinar-card-title">
                                        {webinar.titulo}
                                        {webinar.destacado && <Badge bg="warning" className="ms-2">Destacado</Badge>}
                                    </Card.Title>
                                    <Card.Text className="webinar-description">
                                        {webinar.descripcion || 'Descripción no disponible'}
                                    </Card.Text>
                                    
                                    <div className="webinar-details">
                                        <div className="webinar-detail-item">
                                            <FaCalendarAlt className="detail-icon" />
                                            <span>{formatLocalDateTime(webinar.fecha)}</span>
                                        </div>
                                        {webinar.expositor && (
                                            <div className="webinar-detail-item">
                                                <FaMicrophone className="detail-icon" />
                                                <span>{webinar.expositor}</span>
                                            </div>
                                        )}
                                        {webinar.autor && (
                                            <div className="webinar-detail-item">
                                                <FaUser className="detail-icon" />
                                                <span>{webinar.autor.username}</span>
                                            </div>
                                        )}
                                    </div>
                                </Card.Body>
                                <div className="webinar-card-footer">
                                    <div className="webinar-actions">
                                        {webinar.enlace && (
                                            <Button
                                                variant="success"
                                                onClick={() => window.open(webinar.enlace, '_blank')}
                                                className="webinar-action-btn"
                                            >
                                                <FaExternalLinkAlt style={{ marginRight: '8px' }} />
                                                {getWebinarStatus(webinar) === 'live' ? 'Unirse' : 'Ver'}
                                            </Button>
                                        )}
                                        <Button
                                            variant="outline-primary"
                                            onClick={() => handleViewDetailsClick(webinar)}
                                            className="webinar-action-btn"
                                        >
                                            <FaEye style={{ marginRight: '8px' }} />
                                            Detalles
                                        </Button>
                                        <Button
                                            variant="outline-warning"
                                            onClick={() => handleEditClick(webinar.id)}
                                            className="webinar-action-btn"
                                        >
                                            <FaEdit />
                                        </Button>
                                        <Button
                                            variant="outline-danger"
                                            onClick={() => handleDeleteClick(webinar)}
                                            className="webinar-action-btn"
                                        >
                                            <FaTrash />
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Webinar Details Modal */}
                <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title>
                            <FaVideo style={{ marginRight: '8px' }} />
                            Detalles del Webinar
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {selectedWebinar && (
                            <div className="webinar-details-modal">
                                <div className="webinar-detail-header">
                                    <h3>{selectedWebinar.titulo}</h3>
                                    <div className="d-flex gap-2">
                                        <Badge bg={getStatusColor(getWebinarStatus(selectedWebinar))}>
                                            {getStatusText(getWebinarStatus(selectedWebinar))}
                                        </Badge>
                                        {selectedWebinar.destacado && (
                                            <Badge bg="warning">Destacado</Badge>
                                        )}
                                    </div>
                                </div>
                                
                                {selectedWebinar.imagen && (
                                    <div className="webinar-detail-image mb-3">
                                        <img 
                                            src={selectedWebinar.imagen.startsWith('http') ? selectedWebinar.imagen : `${BASE_URL}${selectedWebinar.imagen}`}
                                            alt={selectedWebinar.titulo}
                                            className="img-fluid rounded"
                                            style={{ maxHeight: '300px', width: '100%', objectFit: 'cover' }}
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                            }}
                                        />
                                    </div>
                                )}
                                
                                <div className="webinar-detail-content">
                                    <div className="webinar-detail-item">
                                        <FaCalendarAlt className="icon" />
                                        <div>
                                            <strong>Fecha y hora:</strong> {formatLocalDateTime(selectedWebinar.fecha)}
                                        </div>
                                    </div>
                                    
                                    {selectedWebinar.expositor && (
                                        <div className="webinar-detail-item">
                                            <FaMicrophone className="icon" />
                                            <div>
                                                <strong>Expositor:</strong> {selectedWebinar.expositor}
                                            </div>
                                        </div>
                                    )}
                                    
                                    {selectedWebinar.autor && (
                                        <div className="webinar-detail-item">
                                            <FaUser className="icon" />
                                            <div>
                                                <strong>Organizador:</strong> {selectedWebinar.autor.username}
                                            </div>
                                        </div>
                                    )}
                                    
                                    {selectedWebinar.enlace && (
                                        <div className="webinar-detail-item">
                                            <FaLink className="icon" />
                                            <div>
                                                <strong>Enlace:</strong> 
                                                <a href={selectedWebinar.enlace} target="_blank" rel="noopener noreferrer">
                                                    {selectedWebinar.enlace}
                                                </a>
                                            </div>
                                        </div>
                                    )}
                                    
                                    <div className="webinar-detail-item">
                                        <FaInfoCircle className="icon" />
                                        <div>
                                            <strong>Descripción:</strong>
                                            <p>{selectedWebinar.descripcion || 'Descripción no disponible'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>
                            Cerrar
                        </Button>
                        {selectedWebinar && selectedWebinar.enlace && (
                            <Button 
                                variant="success" 
                                onClick={() => window.open(selectedWebinar.enlace, '_blank')}
                            >
                                <FaExternalLinkAlt style={{ marginRight: '8px' }} />
                                {getWebinarStatus(selectedWebinar) === 'live' ? 'Unirse al Webinar' : 'Ver Webinar'}
                            </Button>
                        )}
                    </Modal.Footer>
                </Modal>

                {/* Delete Confirmation Modal */}
                <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            <FaTrash style={{ marginRight: '8px' }} />
                            Confirmar Eliminación
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {webinarToDelete && (
                            <div>
                                <p>¿Estás seguro de que quieres eliminar el webinar:</p>
                                <strong>"{webinarToDelete.titulo}"</strong>
                                <p className="mt-2 text-warning">Esta acción no se puede deshacer.</p>
                            </div>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                            Cancelar
                        </Button>
                        <Button variant="danger" onClick={confirmDelete}>
                            <FaTrash style={{ marginRight: '8px' }} />
                            Eliminar
                        </Button>
                    </Modal.Footer>
                </Modal>

                {/* Toast Notifications */}
                <ToastContainer position="top-end" className="p-3">
                    <Toast 
                        bg="success" 
                        onClose={() => setShowToast(false)} 
                        show={showToast} 
                        delay={3000} 
                        autohide
                    >
                        <Toast.Body>{toastMessage}</Toast.Body>
                    </Toast>
                </ToastContainer>
            </Container>
        </div>
    );
}

export default WebinarsPage;