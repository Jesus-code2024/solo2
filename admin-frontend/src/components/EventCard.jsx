import "./EventCard.css"

export default function EventCard({ evento, onAprobar, onRechazar }) {
    return (
        <div className="card">
            <h3>{evento.titulo}</h3>
            <p>{evento.descripcion}</p>
            <small>Desde: {evento.fecha_inicio}</small><br />
            <small>Hasta: {evento.fecha_fin}</small><br />
            <p><strong>Carrera:</strong> {evento.carrera}</p>
            <p><strong>Tipo:</strong> {evento.tipo_evento}</p>

            <div className="buttons">
                <button className="btn btn-approve" onClick={() => onAprobar(evento.id)}>Aprobar</button>
                <button className="btn btn-reject" onClick={() => onRechazar(evento.id)}>Rechazar</button>
            </div>
        </div>
    )
}
