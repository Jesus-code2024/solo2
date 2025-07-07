import { create } from 'zustand'
import axios from 'axios'

export const useAuthStore = create((set) => ({
    token: localStorage.getItem("token") || null,
    username: null,
    loginError: null,

    login: async (username, password) => {
        try {
            const response = await axios.post("http://localhost:8000/api/login/", {
                username,
                password,
            })
            const { token, username: user } = response.data
            localStorage.setItem("token", token)
            axios.defaults.headers.common["Authorization"] = `Token ${token}`
            set({ token, username: user, loginError: null })
            return true  // ✅ Esto es clave
        } catch (error) {
            set({ loginError: "Credenciales inválidas o no eres administrador." })
            return false
        }
    },

    logout: () => {
        localStorage.removeItem("token")
        delete axios.defaults.headers.common["Authorization"]
        set({ token: null, username: null, loginError: null })
    }
}))
