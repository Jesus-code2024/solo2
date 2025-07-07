import { Navigate } from "react-router-dom"
import { useAuthStore } from "../store/authStore.js"

export default function PrivateRoute({ children }) {
    const { token } = useAuthStore()
    return token ? children : <Navigate to="/login" />
}
