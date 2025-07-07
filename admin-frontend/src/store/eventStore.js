import { create } from "zustand"
import { api } from "../services/api.js"

export const useEventStore = create((set) => ({
    eventos: [],
    fetchEventosPendientes: async () => {
        try {
            const res = await api.get("eventos/")
            const pendientes = res.data.filter(e => e.estado === "pendiente")
            set({ eventos: pendientes })
        } catch (err) {
            console.error(err)
        }
    },
    aprobarEvento: async (id) => {
        await api.patch(`eventos/${id}/`, { estado: "aprobado" })
        set(state => ({
            eventos: state.eventos.filter(e => e.id !== id)
        }))
    },
    rechazarEvento: async (id) => {
        await api.patch(`eventos/${id}/`, { estado: "rechazado" })
        set(state => ({
            eventos: state.eventos.filter(e => e.id !== id)
        }))
    }
}))
