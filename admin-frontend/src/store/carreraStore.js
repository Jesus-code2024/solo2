import { create } from "zustand"
import axios from "axios"

export const useCarreraStore = create((set) => ({
    carreras: [],
    fetchCarreras: async () => {
        try {
            const response = await axios.get("http://localhost:8000/api/carreras/")
            set({ carreras: response.data })
        } catch (error) {
            console.error("Error al obtener carreras:", error)
        }
    },
    crearCarrera: async (nombre, departamentoId) => {
        try {
            await axios.post("http://localhost:8000/api/carreras/", {
                nombre,
                departamento: departamentoId
            })
            await set((state) => state.fetchCarreras())
        } catch (error) {
            console.error("Error al crear carrera:", error)
        }
    },
    eliminarCarrera: async (id) => {
        try {
            await axios.delete(`http://localhost:8000/api/carreras/${id}/`)
            await set((state) => state.fetchCarreras())
        } catch (error) {
            console.error("Error al eliminar carrera:", error)
        }
    },
    actualizarCarrera: async (id, nombre, departamentoId) => {
        try {
            await axios.put(`http://localhost:8000/api/carreras/${id}/`, {
                nombre,
                departamento: departamentoId
            })
            await set((state) => state.fetchCarreras())
        } catch (error) {
            console.error("Error al actualizar carrera:", error)
        }
    }
}))
