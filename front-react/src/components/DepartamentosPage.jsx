import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Alert, Modal, Form, Badge } from 'react-bootstrap';
import { 
    FaSearch, 
    FaBuilding, 
    FaEye, 
    FaInfoCircle,
    FaUser,
    FaCode,
    FaHome,
    FaEdit,
    FaPhone,
    FaEnvelope,
    FaMapMarkerAlt,
    FaUsers,
    FaCalendarAlt,
    FaTimes,
    FaHeart,
    FaBookOpen,
    FaChevronRight,
    FaFilter,
    FaSort
} from 'react-icons/fa';
import '../styles/DepartamentosPageNew.css';

const API_URL_DEPARTAMENTOS = 'http://localhost:8080/api/departamentos';

function DepartamentosPage() {
    const [departamentos, setDepartamentos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDepartamento, setSelectedDepartamento] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [favoriteDepartamentos, setFavoriteDepartamentos] = useState([]);
    const [sortBy, setSortBy] = useState('nombre');
    const [filterBy, setFilterBy] = useState('all');
    const [viewMode, setViewMode] = useState('grid');
    const navigate = useNavigate();

    const getAuthHeaders = () => {
        const token = localStorage.getItem('jwtToken');
        return token ? { Authorization: `Bearer ${token}` } : {};
    };

    const fetchDepartamentos = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(API_URL_DEPARTAMENTOS, { headers: getAuthHeaders() });
            setDepartamentos(response.data);
        } catch (err) {
            console.error('Error al cargar los departamentos:', err);
            setError('No se pudieron cargar los departamentos. Por favor, intente de nuevo.');
            if (err.response && err.response.status === 401) {
                localStorage.removeItem('jwtToken');
                navigate('/login');
            } else if (err.response && err.response.status === 403) {
                setError('No tienes permiso para ver los departamentos.');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDepartamentos();
        
        // Cargar favoritos desde localStorage
        const savedFavorites = localStorage.getItem('favoriteDepartamentos');
        if (savedFavorites) {
            setFavoriteDepartamentos(JSON.parse(savedFavorites));
        }
    }, []);

    const toggleFavorite = (departamentoId) => {
        const newFavorites = favoriteDepartamentos.includes(departamentoId)
            ? favoriteDepartamentos.filter(id => id !== departamentoId)
            : [...favoriteDepartamentos, departamentoId];
        
        setFavoriteDepartamentos(newFavorites);
        localStorage.setItem('favoriteDepartamentos', JSON.stringify(newFavorites));
    };

    const handleVerDetalles = (departamento) => {
        setSelectedDepartamento(departamento);
        setShowModal(true);
    };

    const sortDepartamentos = (departamentosToSort) => {
        return [...departamentosToSort].sort((a, b) => {
            switch (sortBy) {
                case 'nombre':
                    return a.nombre.localeCompare(b.nombre);
                case 'codigo':
                    return (a.codigo || '').localeCompare(b.codigo || '');
                case 'favoritos':
                    const aFav = favoriteDepartamentos.includes(a.id);
                    const bFav = favoriteDepartamentos.includes(b.id);
                    return bFav - aFav;
                default:
                    return 0;
            }
        });
    };

    const filteredDepartamentos = departamentos.filter(departamento => {
        const matchesSearch = departamento.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (departamento.codigo && departamento.codigo.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (departamento.responsable && departamento.responsable.toLowerCase().includes(searchTerm.toLowerCase()));
        
        const matchesFilter = filterBy === 'all' || 
            (filterBy === 'favoritos' && favoriteDepartamentos.includes(departamento.id)) ||
            (filterBy === 'con-responsable' && departamento.responsable) ||
            (filterBy === 'con-codigo' && departamento.codigo);
        
        return matchesSearch && matchesFilter;
    });

    const sortedDepartamentos = sortDepartamentos(filteredDepartamentos);

    if (loading) {
        return (
            <div className="departamentos-page">
                <Container>
                    <div className="loading-section">
                        <div className="loading-spinner"></div>
                        <div className="loading-text">Cargando departamentos...</div>
                    </div>
                </Container>
            </div>
        );
    }

    if (error) {
        return (
            <div className="departamentos-page">
                <Container>
                    <div className="error-section">
                        <h3>Error al cargar departamentos</h3>
                        <p>{error}</p>
                    </div>
                </Container>
            </div>
        );
    }

    return (
        <div className="departamentos-page">
            <Container>
                {/* Hero Section */}
                <div className="departamentos-hero">
                    <Row className="align-items-center">
                        <Col md={8}>
                            <h1><FaBuilding className="me-3" />Departamentos</h1>
                            <p>Conoce los diferentes departamentos de nuestra institución</p>
                        </Col>
                        <Col md={4} className="text-md-end">
                            {/* Puedes agregar botones adicionales aquí */}
                        </Col>
                    </Row>
                </div>

                {/* Statistics */}
                <div className="departamentos-stats">
                    <div className="stat-card">
                        <div className="stat-number">{departamentos.length}</div>
                        <div className="stat-label">Total Departamentos</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-number">{sortedDepartamentos.length}</div>
                        <div className="stat-label">Resultados</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-number">{favoriteDepartamentos.length}</div>
                        <div className="stat-label">Favoritos</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-number">
                            {departamentos.filter(d => d.responsable).length}
                        </div>
                        <div className="stat-label">Con Responsable</div>
                    </div>
                </div>

                {/* Filters and Search */}
                <div className="filters-section">
                    <Row>
                        <Col md={5}>
                            <div className="search-container">
                                <input
                                    type="text"
                                    placeholder="Buscar por nombre, código o responsable..."
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
                                <option value="all">Todos los departamentos</option>
                                <option value="favoritos">Mis favoritos</option>
                                <option value="con-responsable">Con responsable</option>
                                <option value="con-codigo">Con código</option>
                            </Form.Select>
                        </Col>
                        <Col md={2}>
                            <Form.Select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="sort-select"
                            >
                                <option value="nombre">Por nombre</option>
                                <option value="codigo">Por código</option>
                                <option value="favoritos">Favoritos</option>
                            </Form.Select>
                        </Col>
                        <Col md={2}>
                            <div className="view-mode-buttons">
                                <Button
                                    className={`view-mode-btn ${viewMode === 'grid' ? 'active' : ''}`}
                                    onClick={() => setViewMode('grid')}
                                >
                                    <FaBuilding />
                                </Button>
                                <Button
                                    className={`view-mode-btn ${viewMode === 'list' ? 'active' : ''}`}
                                    onClick={() => setViewMode('list')}
                                >
                                    <FaBookOpen />
                                </Button>
                            </div>
                        </Col>
                    </Row>
                </div>

                {/* Departamentos Grid */}
                {sortedDepartamentos.length > 0 ? (
                    <div className={`departamentos-container ${viewMode}`}>
                        {sortedDepartamentos.map((departamento) => (
                            <div key={departamento.id} className={`departamento-card ${viewMode}-view`}>
                                <div className="departamento-card-header">
                                    <div className="header-content">
                                        <FaBuilding className="departamento-icon" />
                                        <div className="departamento-title-section">
                                            <div className="departamento-card-code">
                                                {departamento.codigo || 'SIN CÓDIGO'}
                                            </div>
                                            <h4 className="departamento-card-title">
                                                {departamento.nombre}
                                            </h4>
                                        </div>
                                    </div>
                                    <div className="header-actions">
                                        <button
                                            className={`favorite-btn ${favoriteDepartamentos.includes(departamento.id) ? 'favorited' : ''}`}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleFavorite(departamento.id);
                                            }}
                                        >
                                            <FaHeart />
                                        </button>
                                        {departamento.responsable && (
                                            <Badge bg="success" className="responsable-badge">
                                                Con responsable
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                                <div className="departamento-card-body">
                                    <div className="departamento-description">
                                        {departamento.descripcion || 'Departamento de nuestra institución que contribuye al crecimiento académico y profesional.'}
                                    </div>
                                    
                                    {departamento.responsable && (
                                        <div className="departamento-responsible">
                                            <div className="responsible-info">
                                                <FaUser className="responsible-icon" />
                                                <div>
                                                    <div className="responsible-label">Responsable:</div>
                                                    <div className="responsible-name">{departamento.responsable}</div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="departamento-details">
                                        <div className="detail-item">
                                            <FaCode className="detail-icon" />
                                            <div>
                                                <p className="detail-label">Código</p>
                                                <p className="detail-text">{departamento.codigo || 'No asignado'}</p>
                                            </div>
                                        </div>
                                        <div className="detail-item">
                                            <FaBuilding className="detail-icon" />
                                            <div>
                                                <p className="detail-label">Tipo</p>
                                                <p className="detail-text">Departamento académico</p>
                                            </div>
                                        </div>
                                        {departamento.email && (
                                            <div className="detail-item">
                                                <FaEnvelope className="detail-icon" />
                                                <div>
                                                    <p className="detail-label">Email</p>
                                                    <p className="detail-text">{departamento.email}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="departamento-card-footer">
                                    <div className="departamento-actions">
                                        <Button 
                                            className="action-btn primary"
                                            onClick={() => handleVerDetalles(departamento)}
                                        >
                                            <FaEye className="me-2" />
                                            Ver Detalles
                                        </Button>
                                        <Button 
                                            className="action-btn secondary"
                                            onClick={() => toggleFavorite(departamento.id)}
                                        >
                                            <FaHeart className={`me-2 ${favoriteDepartamentos.includes(departamento.id) ? 'favorited' : ''}`} />
                                            {favoriteDepartamentos.includes(departamento.id) ? 'Favorito' : 'Favorito'}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <FaBuilding className="empty-state-icon" />
                        <h3>No se encontraron departamentos</h3>
                        <p>
                            {searchTerm 
                                ? `No hay departamentos que coincidan con "${searchTerm}"`
                                : filterBy === 'favoritos' 
                                    ? 'No tienes departamentos favoritos aún'
                                    : 'No hay departamentos disponibles'
                            }
                        </p>
                    </div>
                )}

                {/* Navigation Button */}
                <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                    <Button 
                        className="action-btn secondary"
                        onClick={() => navigate('/home')}
                        style={{ minWidth: '200px' }}
                    >
                        <FaHome className="me-2" />
                        Volver al Inicio
                    </Button>
                </div>

                {/* Modal de Detalles */}
                <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
                    <Modal.Header closeButton className="modal-header-custom">
                        <Modal.Title>
                            <FaBuilding className="me-2" />
                            {selectedDepartamento?.nombre}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="modal-body-custom">
                        {selectedDepartamento && (
                            <div className="modal-content-custom">
                                <Row>
                                    <Col md={12}>
                                        <div className="modal-info">
                                            <div className="department-header-modal">
                                                <div className="department-icon-large">
                                                    <FaBuilding />
                                                </div>
                                                <div className="department-title-info">
                                                    <h4>{selectedDepartamento.nombre}</h4>
                                                    <p className="department-code-large">
                                                        {selectedDepartamento.codigo || 'SIN CÓDIGO'}
                                                    </p>
                                                </div>
                                            </div>
                                            
                                            <div className="modal-sections">
                                                <div className="modal-section">
                                                    <h5 className="modal-subtitle">
                                                        <FaInfoCircle className="me-2" />
                                                        Información General
                                                    </h5>
                                                    <div className="info-grid">
                                                        <div className="info-item">
                                                            <FaCode className="info-icon" />
                                                            <div>
                                                                <span className="info-label">Código:</span>
                                                                <span className="info-value">{selectedDepartamento.codigo || 'No asignado'}</span>
                                                            </div>
                                                        </div>
                                                        <div className="info-item">
                                                            <FaBuilding className="info-icon" />
                                                            <div>
                                                                <span className="info-label">Tipo:</span>
                                                                <span className="info-value">Departamento académico</span>
                                                            </div>
                                                        </div>
                                                        {selectedDepartamento.email && (
                                                            <div className="info-item">
                                                                <FaEnvelope className="info-icon" />
                                                                <div>
                                                                    <span className="info-label">Email:</span>
                                                                    <span className="info-value">{selectedDepartamento.email}</span>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {selectedDepartamento.responsable && (
                                                    <div className="modal-section">
                                                        <h5 className="modal-subtitle">
                                                            <FaUser className="me-2" />
                                                            Responsable
                                                        </h5>
                                                        <div className="responsable-info-modal">
                                                            <div className="responsable-avatar">
                                                                <FaUser />
                                                            </div>
                                                            <div className="responsable-details">
                                                                <p className="responsable-name">{selectedDepartamento.responsable}</p>
                                                                <p className="responsable-role">Responsable del departamento</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="modal-section">
                                                    <h5 className="modal-subtitle">
                                                        <FaBookOpen className="me-2" />
                                                        Descripción
                                                    </h5>
                                                    <p className="description-modal">
                                                        {selectedDepartamento.descripcion || 'Departamento de nuestra institución que contribuye al crecimiento académico y profesional de la comunidad educativa.'}
                                                    </p>
                                                </div>
                                            </div>
                                            
                                            <div className="favorite-section">
                                                <Button
                                                    className={`favorite-btn-modal ${favoriteDepartamentos.includes(selectedDepartamento.id) ? 'favorited' : ''}`}
                                                    onClick={() => toggleFavorite(selectedDepartamento.id)}
                                                >
                                                    <FaHeart className="me-2" />
                                                    {favoriteDepartamentos.includes(selectedDepartamento.id) ? 'Quitar de favoritos' : 'Agregar a favoritos'}
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

export default DepartamentosPage;