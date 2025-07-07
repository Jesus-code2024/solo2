import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, InputGroup, FormControl, Button, Alert, Spinner } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';
import '../styles/DepartamentosPage.css';

const API_URL_DEPARTAMENTOS = 'http://localhost:8080/api/departamentos';

function DepartamentosPage() {
    const [departamentos, setDepartamentos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
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
    }, []);

    const filteredDepartamentos = departamentos.filter(departamento =>
        departamento.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (departamento.codigo && departamento.codigo.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (departamento.responsable && departamento.responsable.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (loading) {
        return (
            <Container className="text-center mt-5">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </Spinner>
                <p>Cargando departamentos...</p>
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
        <Container fluid className="departamentos-page-container mt-4">
            <Row className="mb-4 align-items-center">
                <Col>
                    <h1>Listado de Departamentos</h1>
                </Col>
            </Row>

            <Row className="mb-4 justify-content-center">
                <Col md={6}>
                    <InputGroup>
                        <FormControl
                            placeholder="Buscar por nombre, código o responsable..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <InputGroup.Text>
                            <FaSearch />
                        </InputGroup.Text>
                    </InputGroup>
                </Col>
            </Row>

            <Row className="departamentos-cards-grid">
                {filteredDepartamentos.length > 0 ? (
                    filteredDepartamentos.map((departamento) => (
                        <Col key={departamento.id} lg={4} md={6} sm={12} className="mb-4">
                            <div className="departamento-card">
                                <div className="departamento-card-details">
                                    <h5 className="departamento-card-code">{departamento.codigo}</h5>
                                    <h4 className="departamento-card-title">{departamento.nombre}</h4>
                                </div>
                            </div>
                        </Col>
                    ))
                ) : (
                    <Col xs={12}>
                        <Alert variant="info" className="text-center">No se encontraron departamentos.</Alert>
                    </Col>
                )}
            </Row>
        </Container>
    );
}

export default DepartamentosPage;