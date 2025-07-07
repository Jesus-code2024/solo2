import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Alert, Form, Button, Modal, Card, Badge } from 'react-bootstrap';
import { 
    FaSearch, 
    FaCalendarAlt, 
    FaMapMarkerAlt, 
    FaUser, 
    FaEye,
    FaFilter,
    FaTimes,
    FaHeart,
    FaShare,
    FaClock,
    FaGraduationCap,
    FaUsers,
    FaChevronRight,
    FaCalendarCheck,
    FaBookmark,
    FaPlay,
    FaInfoCircle
} from 'react-icons/fa';
import '../styles/EventosPage.css';

const API_URL_EVENTOS = 'http://localhost:8080/api/eventos';
const BASE_URL = 'http://localhost:8080';

const formatLocalDateTime = (dateTimeString) => {
    if (!dateTimeString) return 'N/A';
    const date = new Date(dateTimeString);
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
    return date.toLocaleDateString('es-ES', options);
};

function EventosPage() {
    const [eventos, setEventos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedEventType, setSelectedEventType] = useState('all');
    const [sortBy, setSortBy] = useState('fecha');
    const [showFilters, setShowFilters] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [favorites, setFavorites] = useState([]);
    const [viewMode, setViewMode] = useState('grid');
    const navigate = useNavigate();

    const getAuthHeaders = () => {
        const token = localStorage.getItem('jwtToken');
        return token ? { Authorization: `Bearer ${token}` } : {};
    };

    const fetchEventos = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(API_URL_EVENTOS, { headers: getAuthHeaders() });
            setEventos(response.data);
        } catch (err) {
            console.error('Error al cargar los eventos:', err);
            setError('No se pudieron cargar los eventos. Por favor, intente de nuevo.');
            if (err.response && err.response.status === 401) {
                localStorage.removeItem('jwtToken');
                navigate('/login');
            } else if (err.response && err.response.status === 403) {
                setError('No tienes permiso para ver los eventos.');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEventos();
        // Cargar favoritos del localStorage
        const savedFavorites = localStorage.getItem('eventFavorites');
        if (savedFavorites) {
            setFavorites(JSON.parse(savedFavorites));
        }
    }, []);

    const handleViewDetailsClick = (evento) => {
        setSelectedEvent(evento);
        setShowModal(true);
    };

    const toggleFavorite = (eventoId) => {
        const newFavorites = favorites.includes(eventoId)
            ? favorites.filter(id => id !== eventoId)
            : [...favorites, eventoId];
        
        setFavorites(newFavorites);
        localStorage.setItem('eventFavorites', JSON.stringify(newFavorites));
    };

    const shareEvent = (evento) => {
        if (navigator.share) {
            navigator.share({
                title: evento.titulo,
                text: evento.descripcion,
                url: window.location.href
            });
        } else {
            // Fallback para navegadores que no soportan Web Share API
            navigator.clipboard.writeText(window.location.href);
            alert('Enlace copiado al portapapeles');
        }
    };

    const getEventStatus = (evento) => {
        const now = new Date();
        const eventDate = new Date(evento.fechaInicio);
        const eventEndDate = new Date(evento.fechaFin);
        
        if (now < eventDate) return 'upcoming';
        if (now > eventEndDate) return 'past';
        return 'ongoing';
    };

    const getEventTypeColor = (tipo) => {
        const colors = {
            'conferencia': '#667eea',
            'seminario': '#764ba2',
            'workshop': '#f093fb',
            'meetup': '#4facfe',
            'default': '#6c757d'
        };
        return colors[tipo?.toLowerCase()] || colors.default;
    };

    const sortedAndFilteredEventos = eventos
        .filter(evento => {
            const matchesSearch = evento.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (evento.descripcion && evento.descripcion.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (evento.ubicacion && evento.ubicacion.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (evento.autor && evento.autor.username.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (evento.carrera && evento.carrera.nombre.toLowerCase().includes(searchTerm.toLowerCase()));
            
            const matchesType = selectedEventType === 'all' || 
                (selectedEventType === 'upcoming' && getEventStatus(evento) === 'upcoming') ||
                (selectedEventType === 'ongoing' && getEventStatus(evento) === 'ongoing') ||
                (selectedEventType === 'past' && getEventStatus(evento) === 'past') ||
                (selectedEventType === 'favorites' && favorites.includes(evento.id));
            
            return matchesSearch && matchesType;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'fecha':
                    return new Date(a.fechaInicio) - new Date(b.fechaInicio);
                case 'titulo':
                    return a.titulo.localeCompare(b.titulo);
                case 'popularidad':
                    return (b.asistentes || 0) - (a.asistentes || 0);
                default:
                    return 0;
            }
        });

    const filteredEventos = eventos.filter(evento =>
        evento.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (evento.descripcion && evento.descripcion.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (evento.ubicacion && evento.ubicacion.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (evento.autor && evento.autor.username.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (evento.carrera && evento.carrera.nombre.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (loading) {
        return (
            <div className="eventos-page">
                <Container>
                    <div className="loading-section">
                        <div className="loading-spinner"></div>
                        <div className="loading-text">Cargando eventos...</div>
                    </div>
                </Container>
            </div>
        );
    }

    if (error) {
        return (
            <div className="eventos-page">
                <Container>
                    <div className="error-section">
                        <h3>Error al cargar eventos</h3>
                        <p>{error}</p>
                    </div>
                </Container>
            </div>
        );
    }

    return (
        <div className="eventos-page">
            <Container>
                {/* Hero Section */}
                <div className="eventos-hero">
                    <Row className="align-items-center">
                        <Col md={8}>
                            <h1><FaCalendarAlt className="me-3" />Eventos y Actividades</h1>
                            <p>Descubre los eventos más interesantes de nuestra comunidad académica</p>
                        </Col>
                        <Col md={4} className="text-md-end">
                            <Button 
                                variant="outline-light"
                                onClick={() => setShowFilters(!showFilters)}
                                className="me-2"
                            >
                                <FaFilter className="me-2" />
                                Filtros
                            </Button>
                        </Col>
                    </Row>
                </div>

                {/* Statistics */}
                <div className="eventos-stats">
                    <div className="stat-card">
                        <div className="stat-number">{eventos.length}</div>
                        <div className="stat-label">Total Eventos</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-number">
                            {eventos.filter(e => getEventStatus(e) === 'upcoming').length}
                        </div>
                        <div className="stat-label">Próximos</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-number">
                            {eventos.filter(e => getEventStatus(e) === 'ongoing').length}
                        </div>
                        <div className="stat-label">En Curso</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-number">{favorites.length}</div>
                        <div className="stat-label">Favoritos</div>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="search-section">
                    <div className="search-container">
                        <Form.Control
                            type="text"
                            placeholder="Buscar por título, descripción, ubicación, autor o carrera..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                        <FaSearch className="search-icon" />
                    </div>

                    {showFilters && (
                        <div className="filters-section">
                            <Row>
                                <Col md={4}>
                                    <Form.Select 
                                        value={selectedEventType} 
                                        onChange={(e) => setSelectedEventType(e.target.value)}
                                        className="filter-select"
                                    >
                                        <option value="all">Todos los eventos</option>
                                        <option value="upcoming">Próximos</option>
                                        <option value="ongoing">En curso</option>
                                        <option value="past">Pasados</option>
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
                                        <option value="popularidad">Ordenar por popularidad</option>
                                    </Form.Select>
                                </Col>
                                <Col md={4}>
                                    <div className="view-mode-toggle">
                                        <Button 
                                            variant={viewMode === 'grid' ? 'primary' : 'outline-primary'}
                                            onClick={() => setViewMode('grid')}
                                            className="me-2"
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

                {/* Events Grid/List */}
                {sortedAndFilteredEventos.length === 0 ? (
                    <div className="empty-state">
                        <FaCalendarAlt className="empty-state-icon" />
                        <h3>No se encontraron eventos</h3>
                        <p>No hay eventos que coincidan con tu búsqueda o filtros.</p>
                    </div>
                ) : (
                    <div className={`eventos-container ${viewMode}`}>
                        {sortedAndFilteredEventos.map((evento) => (
                            <Card key={evento.id} className="evento-card">
                                <div className="evento-card-image-container">
                                    <Card.Img
                                        variant="top"
                                        src={evento.imagen
                                            ? `${BASE_URL}/uploads/${evento.imagen}`
                                            : 'https://via.placeholder.com/400x250/667eea/FFFFFF?text=Evento'}
                                        alt={evento.titulo}
                                        className="evento-card-img"
                                    />
                                    <div className="evento-image-overlay">
                                        <FaEye className="me-2" />
                                        Ver Detalles
                                    </div>
                                    <div className="evento-status-badge">
                                        <Badge bg={getEventStatus(evento) === 'upcoming' ? 'success' : 
                                                getEventStatus(evento) === 'ongoing' ? 'warning' : 'secondary'}>
                                            {getEventStatus(evento) === 'upcoming' ? 'Próximo' : 
                                             getEventStatus(evento) === 'ongoing' ? 'En Curso' : 'Finalizado'}
                                        </Badge>
                                    </div>
                                    {evento.carrera && (
                                        <div className="evento-career-badge">
                                            <FaGraduationCap className="me-1" />
                                            {evento.carrera.nombre}
                                        </div>
                                    )}
                                </div>
                                <Card.Body className="evento-card-body">
                                    <div className="evento-meta">
                                        <span className="evento-date">
                                            <FaCalendarAlt className="me-1" />
                                            {formatLocalDateTime(evento.fechaInicio)}
                                        </span>
                                        {evento.ubicacion && (
                                            <span className="evento-location">
                                                <FaMapMarkerAlt className="me-1" />
                                                {evento.ubicacion}
                                            </span>
                                        )}
                                    </div>
                                    <Card.Title className="evento-card-title">
                                        {evento.titulo}
                                    </Card.Title>
                                    <Card.Text className="evento-description">
                                        {evento.descripcion || 'Descripción no disponible'}
                                    </Card.Text>
                                    <div className="evento-footer">
                                        <div className="evento-author">
                                            <FaUser className="me-1" />
                                            {evento.autor ? evento.autor.username : 'Autor desconocido'}
                                        </div>
                                        <div className="evento-actions">
                                            <Button
                                                variant="link"
                                                onClick={() => toggleFavorite(evento.id)}
                                                className={`favorite-btn ${favorites.includes(evento.id) ? 'active' : ''}`}
                                            >
                                                <FaHeart />
                                            </Button>
                                            <Button
                                                variant="link"
                                                onClick={() => shareEvent(evento)}
                                                className="share-btn"
                                            >
                                                <FaShare />
                                            </Button>
                                            <Button
                                                className="btn-primary-modern"
                                                onClick={() => handleViewDetailsClick(evento)}
                                            >
                                                <FaEye className="me-2" />
                                                Ver Detalles
                                            </Button>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Event Details Modal */}
                <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title>
                            <FaCalendarAlt className="me-2" />
                            Detalles del Evento
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {selectedEvent && (
                            <div className="event-details">
                                <div className="event-detail-header">
                                    <h3>{selectedEvent.titulo}</h3>
                                    <Badge bg={getEventStatus(selectedEvent) === 'upcoming' ? 'success' : 
                                            getEventStatus(selectedEvent) === 'ongoing' ? 'warning' : 'secondary'}>
                                        {getEventStatus(selectedEvent) === 'upcoming' ? 'Próximo' : 
                                         getEventStatus(selectedEvent) === 'ongoing' ? 'En Curso' : 'Finalizado'}
                                    </Badge>
                                </div>
                                
                                {selectedEvent.imagen && (
                                    <img 
                                        src={`${BASE_URL}/uploads/${selectedEvent.imagen}`}
                                        alt={selectedEvent.titulo}
                                        className="event-detail-image"
                                    />
                                )}
                                
                                <div className="event-detail-content">
                                    <div className="event-detail-item">
                                        <FaCalendarAlt className="icon" />
                                        <div>
                                            <strong>Fecha de inicio:</strong> {formatLocalDateTime(selectedEvent.fechaInicio)}
                                        </div>
                                    </div>
                                    
                                    {selectedEvent.fechaFin && (
                                        <div className="event-detail-item">
                                            <FaClock className="icon" />
                                            <div>
                                                <strong>Fecha de fin:</strong> {formatLocalDateTime(selectedEvent.fechaFin)}
                                            </div>
                                        </div>
                                    )}
                                    
                                    {selectedEvent.ubicacion && (
                                        <div className="event-detail-item">
                                            <FaMapMarkerAlt className="icon" />
                                            <div>
                                                <strong>Ubicación:</strong> {selectedEvent.ubicacion}
                                            </div>
                                        </div>
                                    )}
                                    
                                    {selectedEvent.autor && (
                                        <div className="event-detail-item">
                                            <FaUser className="icon" />
                                            <div>
                                                <strong>Organizador:</strong> {selectedEvent.autor.username}
                                            </div>
                                        </div>
                                    )}
                                    
                                    {selectedEvent.carrera && (
                                        <div className="event-detail-item">
                                            <FaGraduationCap className="icon" />
                                            <div>
                                                <strong>Carrera:</strong> {selectedEvent.carrera.nombre}
                                            </div>
                                        </div>
                                    )}
                                    
                                    <div className="event-detail-item">
                                        <FaInfoCircle className="icon" />
                                        <div>
                                            <strong>Descripción:</strong>
                                            <p>{selectedEvent.descripcion || 'Descripción no disponible'}</p>
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
                        <Button 
                            variant="primary" 
                            onClick={() => {
                                setShowModal(false);
                                navigate(`/eventos/${selectedEvent.id}`);
                            }}
                        >
                            <FaChevronRight className="me-2" />
                            Ir a Página Completa
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Container>
        </div>
    );
}

export default EventosPage;
