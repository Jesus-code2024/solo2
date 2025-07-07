import { create } from "zustand"
import axios from "axios"

export const useTipoEventoStore = create((set) => ({
    tipoEventos: [],
    fetchTipos: async () => {
        try {
            const response = await axios.get("http://localhost:8000/api/tipos/")
            set({ tipoEventos: response.data })
        } catch (error) {
            console.error("Error al obtener tipos:", error)
        }
    },
    crearTipo: async (nombre) => {
        try {
            await axios.post("http://localhost:8000/api/tipos/", { nombre })
            await set((state) => state.fetchTipos())
        } catch (error) {
            console.error("Error al crear tipo:", error)
        }
    },
    eliminarTipo: async (id) => {
        try {
            await axios.delete(`http://localhost:8000/api/tipos/${id}/`)
            await set((state) => state.fetchTipos())
        } catch (error) {
            console.error("Error al eliminar tipo:", error)
        }
    },
    actualizarTipo: async (id, nombre) => {
        try {
            await axios.put(`http://localhost:8000/api/tipos/${id}/`, { nombre })
            await set((state) => state.fetchTipos())
        } catch (error) {
            console.error("Error al actualizar tipo:", error)
        }
    }
}))
