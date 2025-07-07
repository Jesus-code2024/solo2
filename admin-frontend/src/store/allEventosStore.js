import { create } from "zustand"
import axios from "axios"

export const useAllEventosStore = create((set) => ({
    eventos: [],
    fetchTodosEventos: async () => {
        try {
            const res = await axios.get("http://localhost:8000/api/eventos/")
            set({ eventos: res.data })
        } catch (error) {
            console.error("Error al obtener todos los eventos:", error)
        }
    }
}))
