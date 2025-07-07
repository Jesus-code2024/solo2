import { Link, useNavigate } from "react-router-dom"
import { useAuthStore } from "../store/authStore.js"

export default function NavBar() {
    const { logout } = useAuthStore()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate("/login")
    }

    return (
        <nav style={styles.nav}>
            <div style={styles.links}>
                <Link to="/perfil" style={styles.link}>Mi Perfil</Link>
                <Link to="/Usuarios" style={styles.link}>Gestión de Usuarios</Link>
                <Link to="/dashboard" style={styles.link}>Dashboard</Link>
                <Link to="/departamentos" style={styles.link}>Departamentos</Link>
                <Link to="/carreras" style={styles.link}>Carreras</Link>
                <Link to="/tipo-eventos" style={styles.link}>Tipos de Evento</Link>
                <Link to="/eventos" style={styles.link}>Todos los Eventos</Link>
            </div>
            <button onClick={handleLogout} style={styles.button}>
                Cerrar sesión
            </button>
        </nav>
    )
}

const styles = {
    nav: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: "#444",
        padding: "1rem",
        color: "#fff"
    },
    links: {
        display: "flex",
        gap: "1rem"
    },
    link: {
        color: "#fff",
        textDecoration: "none",
        fontWeight: "bold"
    },
    button: {
        background: "#e74c3c",
        color: "#fff",
        border: "none",
        padding: "0.5rem 1rem",
        cursor: "pointer",
        borderRadius: "4px"
    }
}
