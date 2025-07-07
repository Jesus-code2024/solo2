import { useEffect } from "react"
import { useAllEventosStore } from "../store/allEventosStore.js"
import NavBar from "../components/NavBar.jsx"
import Footer from "../components/Footer.jsx"

export default function TodosEventos() {
    const { eventos, fetchTodosEventos } = useAllEventosStore()

    useEffect(() => {
        fetchTodosEventos()
    }, [])

    return (
        <>
            <div className="container">
                <h2>Todos los Eventos</h2>
                {eventos.length === 0 ? (
                    <p>No hay eventos registrados.</p>
                ) : (
                    <table style={{ width: "100%", marginTop: "20px" }}>
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Título</th>
                            <th>Tipo</th>
                            <th>Departamento</th>
                            <th>Carrera</th>
                            <th>Estado</th>
                        </tr>
                        </thead>
                        <tbody>
                        {eventos.map((ev) => (
                            <tr key={ev.id}>
                                <td>{ev.id}</td>
                                <td>{ev.titulo}</td>
                                <td>{ev.tipo.nombre}</td>
                                <td>{ev.departamento.nombre}</td>
                                <td>{ev.carrera.nombre}</td>
                                <td>{ev.estado}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>
        </>
    )
}
