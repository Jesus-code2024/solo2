import { useEffect, useState } from "react"
import { useTipoEventoStore } from "../store/tipoEventoStore.js"
import TipoEventoList from "../components/TipoEventoList.jsx"
import Footer from "../components/Footer.jsx"

export default function TipoEventos() {
    const {
        tipoEventos,
        fetchTipos,
        crearTipo,
        eliminarTipo,
        actualizarTipo
    } = useTipoEventoStore()

    const [nombre, setNombre] = useState("")
    const [editando, setEditando] = useState(null)

    useEffect(() => {
        fetchTipos()
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault()
        if (editando) {
            actualizarTipo(editando.id, nombre)
            setEditando(null)
        } else {
            crearTipo(nombre)
        }
        setNombre("")
    }

    return (
        <>
            <div className="container">
                <h2>Gestión de Tipos de Evento</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Nombre del tipo"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        required
                    />
                    <button type="submit">
                        {editando ? "Actualizar" : "Crear"}
                    </button>
                </form>

                <TipoEventoList
                    tipos={tipoEventos}
                    onEdit={(tipo) => {
                        setEditando(tipo)
                        setNombre(tipo.nombre)
                    }}
                    onDelete={eliminarTipo}
                />
            </div>
            <Footer />
        </>
    )
}
