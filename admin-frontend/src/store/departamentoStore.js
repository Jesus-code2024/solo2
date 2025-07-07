import { create } from 'zustand'
import axios from 'axios'

export const useDepartamentoStore = create((set) => ({
    departamentos: [],
    loading: false,

    fetchDepartamentos: async () => {
        set({ loading: true })
        try {
            const response = await axios.get("http://localhost:8000/api/departamentos/")
            set({ departamentos: response.data })
        } catch (error) {
            console.error("Error al obtener departamentos:", error)
        } finally {
            set({ loading: false })
        }
    },

    crearDepartamento: async (nombre) => {
        try {
            await axios.post("http://localhost:8000/api/departamentos/", { nombre })
            await set((state) => state.fetchDepartamentos())
        } catch (error) {
            console.error("Error al crear departamento:", error)
        }
    },

    actualizarDepartamento: async (id, nombre) => {
        try {
            await axios.put(`http://localhost:8000/api/departamentos/${id}/`, { nombre })
            await set((state) => state.fetchDepartamentos())
        } catch (error) {
            console.error("Error al actualizar:", error)
        }
    },

    eliminarDepartamento: async (id) => {
        try {
            await axios.delete(`http://localhost:8000/api/departamentos/${id}/`)
            await set((state) => state.fetchDepartamentos())
        } catch (error) {
            console.error("Error al eliminar:", error)
        }
    }
}))
