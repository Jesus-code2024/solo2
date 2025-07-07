import { useAuthStore } from "../store/authStore.js"
import "../assets/perfil.css" // Estilos personalizados

export default function Perfil() {
    const { username, logout } = useAuthStore()

    return (
        <div className="perfil-container">
            <div className="perfil-card">
                <img
                    src="https://i.pravatar.cc/150?img=32"
                    alt="avatar"
                    className="perfil-avatar"
                />
                <h2>{username}</h2>
                <p className="perfil-rol">Administrador</p>

                <button className="btn-logout" onClick={logout}>
                    Cerrar sesión
                </button>
            </div>
        </div>
    )
}
