import { useEffect, useState } from "react"
import { useDepartamentoStore } from "../store/departamentoStore.js"
import DepartamentoForm from "../components/DepartamentoForm.jsx"
import DepartamentoList from "../components/DepartamentoList.jsx"

export default function Departamentos({ soloContenido = false }) {
    const {
        departamentos,
        fetchDepartamentos,
        crearDepartamento,
        actualizarDepartamento,
        eliminarDepartamento,
    } = useDepartamentoStore()

    const [editando, setEditando] = useState(null)

    useEffect(() => {
        fetchDepartamentos()
    }, [])

    const handleSubmit = (nombre) => {
        if (editando) {
            actualizarDepartamento(editando.id, nombre)
            setEditando(null)
        } else {
            crearDepartamento(nombre)
        }
    }

    return (
        <div className={soloContenido ? "" : "container"}>
            {!soloContenido && <h2>Gestión de Departamentos</h2>}

            <DepartamentoForm onSubmit={handleSubmit} initialData={editando} />

            <DepartamentoList
                departamentos={departamentos}
                onEdit={(dep) => setEditando(dep)}
                onDelete={eliminarDepartamento}
            />
        </div>
    )
}
