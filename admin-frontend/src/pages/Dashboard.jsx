import { useEffect } from "react"
import { useEventStore } from "../store/eventStore.js"
import EventCard from "../components/EventCard.jsx"
import { useAuthStore } from "../store/authStore.js"


export default function Dashboard() {
    const { eventos, fetchEventosPendientes, aprobarEvento, rechazarEvento } = useEventStore()
    const { logout } = useAuthStore() // ✅ esto va fuera del return

    useEffect(() => {
        fetchEventosPendientes()
    }, [])

    return (
        <div className="container">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h1>Panel de Revisión de Eventos</h1>
            </div>
            {eventos.length === 0 ? (
                <p>No hay eventos pendientes</p>
            ) : (
                eventos.map(evento => (
                    <EventCard
                        key={evento.id}
                        evento={evento}
                        onAprobar={aprobarEvento}
                        onRechazar={rechazarEvento}
                    />
                ))
            )}
        </div>
    )
}
