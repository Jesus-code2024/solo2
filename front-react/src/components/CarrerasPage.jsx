import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Spinner, Alert, Form, Button, Modal, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { 
    FaGraduationCap, 
    FaSearch, 
    FaEye, 
    FaInfoCircle,
    FaUsers,
    FaBuilding,
    FaFilter,
    FaTimes,
    FaCalendarAlt,
    FaClock,
    FaBookOpen,
    FaLightbulb,
    FaHeart,
    FaChevronRight
} from 'react-icons/fa';
import '../styles/CarrerasPage.css';

const API_URL_CARRERAS = 'http://localhost:8080/api/carreras';
const BASE_URL = 'http://localhost:8080';

function CarrerasPage() {
    const [carreras, setCarreras] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCarrera, setSelectedCarrera] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [favoriteCarreras, setFavoriteCarreras] = useState([]);
    const [sortBy, setSortBy] = useState('nombre');
    const [filterBy, setFilterBy] = useState('all');
    const navigate = useNavigate();

    const obtenerCabecerasAuth = () => {
        const token = localStorage.getItem('jwtToken');
        return token ? { Authorization: `Bearer ${token}` } : {};
    };

    useEffect(() => {
        const cargarCarreras = async () => {
            try {
                const headers = obtenerCabecerasAuth();
                const response = await axios.get(API_URL_CARRERAS, { headers });
                setCarreras(response.data);
                setCargando(false);
            } catch (err) {
                console.error("Error cargando carreras:", err);
                setError('Error al cargar las carreras.');
                setCargando(false);
                if (err.response?.status === 401) {
                    localStorage.removeItem('jwtToken');
                    navigate('/login');
                }
            }
        };

        cargarCarreras();
        
        // Cargar favoritos desde localStorage
        const savedFavorites = localStorage.getItem('favoriteCarreras');
        if (savedFavorites) {
            setFavoriteCarreras(JSON.parse(savedFavorites));
        }
    }, [navigate]);

    const toggleFavorite = (carreraId) => {
        const newFavorites = favoriteCarreras.includes(carreraId)
            ? favoriteCarreras.filter(id => id !== carreraId)
            : [...favoriteCarreras, carreraId];
        
        setFavoriteCarreras(newFavorites);
        localStorage.setItem('favoriteCarreras', JSON.stringify(newFavorites));
    };

    const handleVerDetalles = (carrera) => {
        setSelectedCarrera(carrera);
        setShowModal(true);
    };

    const sortCarreras = (carrerasToSort) => {
        return [...carrerasToSort].sort((a, b) => {
            switch (sortBy) {
                case 'nombre':
                    return a.nombre.localeCompare(b.nombre);
                case 'codigo':
                    return a.codigo.localeCompare(b.codigo);
                case 'favoritos':
                    const aFav = favoriteCarreras.includes(a.id);
                    const bFav = favoriteCarreras.includes(b.id);
                    return bFav - aFav;
                default:
                    return 0;
            }
        });
    };

    if (cargando) {
        return (
            <div className="carreras-page">
                <Container>
                    <div className="loading-section">
                        <div className="loading-spinner"></div>
                        <div className="loading-text">Cargando carreras...</div>
                    </div>
                </Container>
            </div>
        );
    }

    if (error) {
        return (
            <div className="carreras-page">
                <Container>
                    <div className="error-section">
                        <h3>Error al cargar carreras</h3>
                        <p>{error}</p>
                    </div>
                </Container>
            </div>
        );
    }

    const filteredCarreras = carreras.filter(carrera => {
        const matchesSearch = carrera.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            carrera.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
            carrera.codigo.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesFilter = filterBy === 'all' || 
            (filterBy === 'favoritos' && favoriteCarreras.includes(carrera.id)) ||
            (filterBy === 'con-imagen' && carrera.imagen);
        
        return matchesSearch && matchesFilter;
    });

    const sortedCarreras = sortCarreras(filteredCarreras);

    return (
        <div className="carreras-page">
            <Container>
                {/* Hero Section */}
                <div className="carreras-hero">
                    <Row className="align-items-center">
                        <Col md={8}>
                            <h1><FaGraduationCap className="me-3" />Nuestras Carreras</h1>
                            <p>Descubre las carreras profesionales que ofrecemos y encuentra tu vocación</p>
                        </Col>
                        <Col md={4} className="text-md-end">
                            {/* Puedes agregar botones adicionales aquí */}
                        </Col>
                    </Row>
                </div>

                {/* Statistics */}
                <div className="carreras-stats">
                    <div className="stat-card">
                        <div className="stat-number">{carreras.length}</div>
                        <div className="stat-label">Total Carreras</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-number">{sortedCarreras.length}</div>
                        <div className="stat-label">Resultados</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-number">{favoriteCarreras.length}</div>
                        <div className="stat-label">Favoritas</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-number">
                            {carreras.filter(c => c.imagen).length}
                        </div>
                        <div className="stat-label">Con Imagen</div>
                    </div>
                </div>

                {/* Filters and Search */}
                <div className="filters-section">
                    <Row>
                        <Col md={6}>
                            <div className="search-container">
                                <Form.Control
                                    type="text"
                                    placeholder="Buscar por nombre, código o descripción..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="search-input"
                                />
                                <FaSearch className="search-icon" />
                            </div>
                        </Col>
                        <Col md={3}>
                            <Form.Select
                                value={filterBy}
                                onChange={(e) => setFilterBy(e.target.value)}
                                className="filter-select"
                            >
                                <option value="all">Todas las carreras</option>
                                <option value="favoritos">Mis favoritas</option>
                                <option value="con-imagen">Con imagen</option>
                            </Form.Select>
                        </Col>
                        <Col md={3}>
                            <Form.Select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="sort-select"
                            >
                                <option value="nombre">Ordenar por nombre</option>
                                <option value="codigo">Ordenar por código</option>
                                <option value="favoritos">Favoritas primero</option>
                            </Form.Select>
                        </Col>
                    </Row>
                </div>

                {/* Carreras Grid */}
                {sortedCarreras.length === 0 && !cargando && !error ? (
                    <div className="empty-state">
                        <FaGraduationCap className="empty-state-icon" />
                        <h3>No se encontraron carreras</h3>
                        <p>
                            {searchTerm 
                                ? `No hay carreras que coincidan con "${searchTerm}"`
                                : filterBy === 'favoritos' 
                                    ? 'No tienes carreras favoritas aún'
                                    : 'No hay carreras disponibles'
                            }
                        </p>
                    </div>
                ) : (
                    <div className="carreras-grid">
                        {sortedCarreras.map((carrera) => (
                            <Card key={carrera.id} className="carrera-card">
                                <div className="carrera-card-image-container">
                                    <Card.Img
                                        variant="top"
                                        src={carrera.imagen
                                            ? `${BASE_URL}/uploads/${carrera.imagen}`
                                            : 'https://via.placeholder.com/400x250/667eea/FFFFFF?text=No+Imagen'}
                                        alt={carrera.nombre}
                                        className="carrera-card-img"
                                    />
                                    <div className="carrera-image-overlay">
                                        <FaEye className="me-2" />
                                        Ver Detalles
                                    </div>
                                    <div className="card-tag">
                                        <FaGraduationCap className="me-2" />
                                        <span>{carrera.codigo}</span>
                                    </div>
                                    <button
                                        className={`favorite-btn ${favoriteCarreras.includes(carrera.id) ? 'favorited' : ''}`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleFavorite(carrera.id);
                                        }}
                                    >
                                        <FaHeart />
                                    </button>
                                </div>
                                <Card.Body className="card-body">
                                    <Card.Title className="carrera-card-title">
                                        {carrera.nombre}
                                    </Card.Title>
                                    <Card.Text className="card-text">
                                        {carrera.descripcion}
                                    </Card.Text>
                                    <div className="carrera-meta">
                                        <div className="meta-item">
                                            <FaBookOpen className="me-2" />
                                            Código: {carrera.codigo}
                                        </div>
                                        <div className="meta-item">
                                            <FaLightbulb className="me-2" />
                                            Carrera profesional
                                        </div>
                                    </div>
                                    <div className="carrera-actions">
                                        <Button 
                                            className="action-btn primary"
                                            onClick={() => handleVerDetalles(carrera)}
                                        >
                                            <FaInfoCircle className="me-2" />
                                            Ver Detalles
                                        </Button>
                                        <Button 
                                            className="action-btn secondary"
                                            onClick={() => toggleFavorite(carrera.id)}
                                        >
                                            <FaHeart className={`me-2 ${favoriteCarreras.includes(carrera.id) ? 'favorited' : ''}`} />
                                            {favoriteCarreras.includes(carrera.id) ? 'Favorita' : 'Favorito'}
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Navigation Button */}
                <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                    <Button 
                        className="action-btn secondary"
                        onClick={() => navigate('/home')}
                        style={{ minWidth: '200px' }}
                    >
                        <FaBuilding className="me-2" />
                        Volver al Inicio
                    </Button>
                </div>

                {/* Modal de Detalles */}
                <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
                    <Modal.Header closeButton className="modal-header-custom">
                        <Modal.Title>
                            <FaGraduationCap className="me-2" />
                            {selectedCarrera?.nombre}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="modal-body-custom">
                        {selectedCarrera && (
                            <div className="modal-content-custom">
                                <Row>
                                    <Col md={4}>
                                        <div className="modal-image-container">
                                            <img
                                                src={selectedCarrera.imagen
                                                    ? `${BASE_URL}/uploads/${selectedCarrera.imagen}`
                                                    : 'https://via.placeholder.com/300x200/667eea/FFFFFF?text=No+Imagen'}
                                                alt={selectedCarrera.nombre}
                                                className="modal-image"
                                            />
                                        </div>
                                    </Col>
                                    <Col md={8}>
                                        <div className="modal-info">
                                            <h5 className="modal-subtitle">Información General</h5>
                                            <div className="info-item">
                                                <FaBookOpen className="info-icon" />
                                                <span className="info-label">Código:</span>
                                                <span className="info-value">{selectedCarrera.codigo}</span>
                                            </div>
                                            <div className="info-item">
                                                <FaGraduationCap className="info-icon" />
                                                <span className="info-label">Carrera:</span>
                                                <span className="info-value">{selectedCarrera.nombre}</span>
                                            </div>
                                            <div className="info-item description">
                                                <FaLightbulb className="info-icon" />
                                                <span className="info-label">Descripción:</span>
                                                <p className="info-description">{selectedCarrera.descripcion}</p>
                                            </div>
                                            <div className="favorite-section">
                                                <Button
                                                    className={`favorite-btn-modal ${favoriteCarreras.includes(selectedCarrera.id) ? 'favorited' : ''}`}
                                                    onClick={() => toggleFavorite(selectedCarrera.id)}
                                                >
                                                    <FaHeart className="me-2" />
                                                    {favoriteCarreras.includes(selectedCarrera.id) ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                                                </Button>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        )}
                    </Modal.Body>
                    <Modal.Footer className="modal-footer-custom">
                        <Button 
                            className="action-btn secondary"
                            onClick={() => setShowModal(false)}
                        >
                            <FaTimes className="me-2" />
                            Cerrar
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Container>
        </div>
    );
}

export default CarrerasPage;
