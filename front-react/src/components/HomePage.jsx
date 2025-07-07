// src/components/HomePage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Carousel,
  Card,
  Spinner,
  Alert,
  Button,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../styles/HeroCarousel.css";
import "../styles/EventCardList.css";
import "../styles/DiscoverTecsup.css";
import "../styles/WebinarCard.css"; // <-- ¡IMPORTA EL NUEVO ARCHIVO CSS!

const API_URL_EVENTOS = "http://localhost:8080/api/eventos";
const API_URL_WEBINARS = "http://localhost:8080/api/webinars";
const API_URL_DESTACADOS = "http://localhost:8080/api/destacados";
const BASE_URL = "http://localhost:8080";

const formatLocalDateTime = (cadenaFechaHora) => {
  if (!cadenaFechaHora) return "N/A";
  const fecha = new Date(cadenaFechaHora);

  if (isNaN(fecha.getTime())) {
    return "N/A";
  }

  const opcionesFecha = { year: "numeric", month: "long", day: "numeric" };
  const fechaFormateada = fecha.toLocaleDateString("es-ES", opcionesFecha);

  const opcionesHora = { hour: "2-digit", minute: "2-digit", hour12: true };
  const horaFormateada = fecha.toLocaleTimeString("es-ES", opcionesHora);

  return `${fechaFormateada}, ${horaFormateada}`;
};

function HomePage() {
  const [eventosRegulares, setEventosRegulares] = useState([]);
  const [webinars, setWebinars] = useState([]);
  const [elementosDestacados, setElementosDestacados] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const navegar = useNavigate();

  const obtenerCabecerasAuth = () => {
    const token = localStorage.getItem("jwtToken");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const cabeceras = obtenerCabecerasAuth();
        const eventosRes = await axios.get(API_URL_EVENTOS, {
          headers: cabeceras,
        });
        const eventosNoDestacados = eventosRes.data.filter(
          (e) => e.destacado === 0 || e.destacado === false
        );
        setEventosRegulares(eventosNoDestacados);

        const webinarsRes = await axios.get(API_URL_WEBINARS, {
          headers: cabeceras,
        });
        setWebinars(webinarsRes.data);

        const destacadosRes = await axios.get(API_URL_DESTACADOS, {
          headers: cabeceras,
        });
        setElementosDestacados(destacadosRes.data);

        setCargando(false);
      } catch (err) {
        setError("Error cargando datos.");
        setCargando(false);
        if (err.response?.status === 401) {
          localStorage.removeItem("jwtToken");
          navegar("/login");
        }
      }
    };

    cargarDatos();
  }, [navegar]);

  const renderizarItemListaEvento = (item) => {
    const urlImagen = item.imagen
      ? item.imagen.startsWith("http://") || item.imagen.startsWith("https://")
        ? item.imagen
        : `${BASE_URL}/uploads/${item.imagen}`
      : "https://placehold.co/1200x300/png?text=Banner+Evento";

    const titulo = item.titulo || "Sin título";
    const ubicacion = item.ubicacion || "Ubicación N/A";
    const fechaHoraCompleta = formatLocalDateTime(
      item.fechaInicio || item.fecha
    );

    return (
      <div
        key={item.id}
        className="event-banner-card mb-4"
        style={{ backgroundImage: `url(${urlImagen})` }}
      >
        <div className="event-banner-overlay">
          <div className="event-banner-content">
            <h3 className="event-banner-title">{titulo}</h3>
            <p className="event-banner-details">
              📍 <strong>{ubicacion}</strong>
              {fechaHoraCompleta !== "N/A" && (
                <span>
                  {" "}
                  | 🗓️ <strong>{fechaHoraCompleta}</strong>
                </span>
              )}
            </p>
            <Button
              variant="primary"
              className="event-banner-button"
              onClick={() => navegar(`/eventos/${item.id}`)}
            >
              Ver Detalles
            </Button>
          </div>
          <div className="event-banner-indicator">+ 26</div>
        </div>
      </div>
    );
  };

  // renderizarTarjeta - MODIFICADA
  const renderizarTarjeta = (item, tipo) => {
    const urlImagen = item.imagen
      ? item.imagen.startsWith("http://") || item.imagen.startsWith("https://")
        ? item.imagen
        : `${BASE_URL}/uploads/${item.imagen}`
      : "https://placehold.co/400x200/png?text=No+Imagen";

    const titulo = item.titulo || "Sin título";
    const descripcion = item.descripcion || "Sin descripción";
    const infoFecha = item.fechaInicio
      ? formatLocalDateTime(item.fechaInicio)
      : item.fecha
      ? formatLocalDateTime(item.fecha)
      : "Fecha N/A";

    return (
      <Col md={4} className="mb-4 d-flex align-items-stretch">
        <Card className="webinar-card h-100 shadow-sm"> {/* Aplicamos la nueva clase webinar-card */}
          {/* Lógica condicional: SOLO muestra Card.Img si el tipo NO es 'webinar'
              Para los webinars, podríamos no mostrar imagen o usar un ícono/placeholder fijo */}
          {/* Si quieres una imagen genérica para webinars, puedes descomentar y ajustar: */}
          {/* <Card.Img
            variant="top"
            src={tipo === "webinar" ? "https://placehold.co/600x300/png?text=Webinar" : urlImagen}
            alt={titulo}
            className="webinar-card-img"
          /> */}
          <Card.Body className="webinar-card-body d-flex flex-column"> {/* Flex column para auto-ajuste */}
            <Card.Title className="webinar-card-title">{titulo}</Card.Title>
            <Card.Text className="webinar-card-meta text-muted">
              <span className="webinar-card-icon">🗓️</span> {`Fecha: ${infoFecha}`}
              {tipo === "webinar" &&
                item.expositor && (
                  <>
                    <span className="webinar-card-icon ms-3">🗣️</span> {`Expositor: ${item.expositor}`}
                  </>
                )}
            </Card.Text>
            <Card.Text className="webinar-card-description flex-grow-1"> {/* Permite que la descripción crezca */}
              {descripcion}
            </Card.Text>
            <div className="mt-auto pt-3"> {/* mt-auto para empujar el botón hacia abajo */}
              <Button
                variant="primary"
                className="webinar-card-button"
                onClick={() =>
                  navegar(
                    `/${item.fechaInicio ? "eventos" : "webinars"}/${item.id}`
                  )
                }
              >
                Ver Detalles
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Col>
    );
  };

  if (cargando)
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
        <p>Cargando...</p>
      </Container>
    );

  if (error)
    return (
      <Container className="mt-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );

  return (
    <Container fluid className="home-page-container p-0">
      {/* Destacados (mantienen imagen) */}
      <Carousel fade className="hero-carousel">
        {elementosDestacados.map((item, index) => (
          <Carousel.Item key={index}>
            <div
              className="hero-carousel-item-bg"
              style={{
                backgroundImage: `url(${
                  item.imagen?.startsWith("http")
                    ? item.imagen
                    : BASE_URL + "/uploads/" + item.imagen
                })`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                height: "600px",
              }}
            >
              <Carousel.Caption className="hero-carousel-caption align-items-center justify-content-start text-start w-100 h-100">
                <div className="carousel-content-wrapper">
                  <h3 className="hero-carousel-title">{item.titulo}</h3>
                  <p className="hero-carousel-description">{item.descripcion}</p>
                  <Button
                    variant="light"
                    className="hero-carousel-button"
                    onClick={() => navegar(`/${item.tipo}s/${item.id}`)}
                  >
                    Ver Detalles
                  </Button>
                </div>
              </Carousel.Caption>
            </div>
          </Carousel.Item>
        ))}
      </Carousel>

      {/* Resto del código de HomePage.jsx permanece igual */}
      {/* Lista de eventos (Próximos Eventos) - mantiene imagen */}
      <Container className="mt-5">
        <h2 className="text-center mb-4">Próximos Eventos</h2>
        <div className="event-list-container">
          {eventosRegulares.length > 0 ? (
            eventosRegulares.map(renderizarItemListaEvento)
          ) : (
            <Row>
              <Col className="text-center">
                <Alert variant="info">No hay eventos disponibles.</Alert>
              </Col>
            </Row>
          )}
        </div>
      </Container>

      {/* SECCIÓN DE ÚLTIMOS WEBINARS (CARRUSEL DE 3 COLUMNAS - IMAGEN ELIMINADA) */}
      <Container className="mt-5">
        <h2 className="text-center mb-4 webinar-section-title">Últimos Webinars</h2> {/* Nueva clase para el título */}
        {webinars.length > 0 ? (
          <Carousel
            indicators={false}
            interval={null}
            className="custom-carousel webinar-carousel" // Nueva clase para el carrusel de webinars
          >
            {Array.from({ length: Math.ceil(webinars.length / 3) }).map(
              (_, index) => (
                <Carousel.Item key={index}>
                  <Row className="justify-content-center">
                    {webinars.slice(index * 3, index * 3 + 3).map((webinar) => (
                      <React.Fragment key={webinar.id}>
                        {renderizarTarjeta(webinar, "webinar")}{" "}
                      </React.Fragment>
                    ))}
                  </Row>
                </Carousel.Item>
              )
            )}
          </Carousel>
        ) : (
          <Row>
            <Col className="text-center">
              <Alert variant="info">
                No hay webinars disponibles en este momento.
              </Alert>
            </Col>
          </Row>
        )}
      </Container>

      {/* Sección de Descubre más sobre Tecsup */}
      <div className="discover-tecsup-section my-5">
        <Container>
          <Row>
            <Col className="text-center">
              <h3 className="discover-tecsup-title">Descubre más sobre Tecsup</h3>
              <p className="discover-tecsup-description">
                Explora nuestras publicaciones, carreras y departamentos.
              </p>
              <Button
                variant="primary"
                className="discover-tecsup-button me-3"
                onClick={() => navegar("/publications")}
              >
                Ver Publicaciones
              </Button>
              <Button
                variant="primary"
                className="discover-tecsup-button"
                onClick={() => navegar("/carreras")}
              >
                Ver Carreras
              </Button>
            </Col>
          </Row>
        </Container>
      </div>
    </Container>
  );
}

export default HomePage;