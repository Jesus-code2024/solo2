import { Routes, Route, Navigate, Outlet } from "react-router-dom"
import Login from "../../../Back-End1/admin-frontend/src/pages/Login"
import Dashboard from "../../../Back-End1/admin-frontend/src/pages/Dashboard"
import Departamentos from "../../../Back-End1/admin-frontend/src/pages/Departamentos"
import Carreras from "../../../Back-End1/admin-frontend/src/pages/Carreras"
import TipoEventos from "../../../Back-End1/admin-frontend/src/pages/TipoEventos"
import TodosEventos from "../../../Back-End1/admin-frontend/src/pages/TodosEventos"
import Perfil from "../../../Back-End1/admin-frontend/src/pages/Perfil"
import PrivateRoute from "../../../Back-End1/admin-frontend/src/components/PrivateRoute"
import NavBar from "../../../Back-End1/admin-frontend/src/components/NavBar"
import Footer from "../../../Back-End1/admin-frontend/src/components/Footer" // 👈 Agregado
import Usuarios from "../../../Back-End1/admin-frontend/src/pages/Usuarios"

function LayoutConNavYFooter() {
    return (
        <>
            <NavBar />
            <div style={{ padding: "1rem", minHeight: "calc(100vh - 120px)" }}>
                <Outlet />
            </div>
            <Footer /> {/* 👈 Agregado aquí */}
        </>
    )
}

export default function App() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />

            <Route
                element={
                    <PrivateRoute>
                        <LayoutConNavYFooter />
                    </PrivateRoute>
                }
            >
                <Route path="/perfil" element={<Perfil />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/departamentos" element={<Departamentos />} />
                <Route path="/carreras" element={<Carreras />} />
                <Route path="/tipo-eventos" element={<TipoEventos />} />
                <Route path="/eventos" element={<TodosEventos />} />
                <Route path="/usuarios" element={<Usuarios />} />
            </Route>

            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
    )
}
