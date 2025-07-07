import { useEffect, useState } from "react"
import { useCarreraStore } from "../store/carreraStore.js"
import { useDepartamentoStore } from "../store/departamentoStore.js"
import CarreraList from "../components/CarreraList.jsx"
import NavBar from "../components/NavBar.jsx"
import Footer from "../components/Footer.jsx"

export default function Carreras() {
    const {
        carreras,
        fetchCarreras,
        crearCarrera,
        eliminarCarrera,
        actualizarCarrera
    } = useCarreraStore()
    const { departamentos, fetchDepartamentos } = useDepartamentoStore()

    const [nombre, setNombre] = useState("")
    const [departamentoId, setDepartamentoId] = useState("")
    const [editando, setEditando] = useState(null)

    useEffect(() => {
        fetchCarreras()
        fetchDepartamentos()
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault()
        if (editando) {
            actualizarCarrera(editando.id, nombre, departamentoId)
            setEditando(null)
        } else {
            crearCarrera(nombre, departamentoId)
        }
        setNombre("")
        setDepartamentoId("")
    }

    return (
        <>

            <div className="container">
                <h2>Gestión de Carreras</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Nombre de la carrera"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        required
                    />
                    <select
                        value={departamentoId}
                        onChange={(e) => setDepartamentoId(e.target.value)}
                        required
                    >
                        <option value="">Selecciona un departamento</option>
                        {departamentos.map((dep) => (
                            <option key={dep.id} value={dep.id}>
                                {dep.nombre}
                            </option>
                        ))}
                    </select>
                    <button type="submit">
                        {editando ? "Actualizar" : "Crear"}
                    </button>
                </form>

                <CarreraList
                    carreras={carreras}
                    onEdit={(car) => {
                        setEditando(car)
                        setNombre(car.nombre)
                        setDepartamentoId(car.departamento)
                    }}
                    onDelete={eliminarCarrera}
                />
            </div>
        </>
    )
}
