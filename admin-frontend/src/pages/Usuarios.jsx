import { useEffect, useState } from "react"
import axios from "axios"
import { useAuthStore } from "../store/authStore.js"
import "../assets/usuarios.css"

export default function Usuarios() {
    const { token } = useAuthStore()
    const [usuarios, setUsuarios] = useState([])

    useEffect(() => {
        axios.get("http://localhost:8000/api/usuarios/", {
            headers: {
                Authorization: `Token ${token}`,
            },
        })
            .then(res => setUsuarios(res.data))
            .catch(err => console.error("Error al cargar usuarios", err))
    }, [])

    return (
        <div className="container">
            <h2>Gestión de Usuarios</h2>
            <table className="tabla-usuarios">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Usuario</th>
                    <th>Email</th>
                    <th>¿Es Staff?</th>
                    <th>Acciones</th>
                </tr>
                </thead>
                <tbody>
                {usuarios.map(user => (
                    <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.username}</td>
                        <td>{user.email}</td>
                        <td>{user.is_staff ? "✅" : "❌"}</td>
                        <td>
                            <button className="btn-ver">Ver</button>
                            <button className="btn-deshabilitar">Deshabilitar</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    )
}
