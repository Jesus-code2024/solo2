import { useState, useEffect } from "react"

export default function DepartamentoForm({ onSubmit, initialData }) {
    const [nombre, setNombre] = useState("")

    useEffect(() => {
        if (initialData) {
            setNombre(initialData.nombre)
        }
    }, [initialData])

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!nombre.trim()) return
        onSubmit(nombre)
        setNombre("")
    }

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Nombre del departamento"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
            />
            <button type="submit">{initialData ? "Actualizar" : "Crear"}</button>
        </form>
    )
}
