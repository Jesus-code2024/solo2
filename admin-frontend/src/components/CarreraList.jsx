export default function CarreraList({ carreras, onEdit, onDelete }) {
    if (!carreras || carreras.length === 0) {
        return <p>No hay carreras registradas.</p>
    }

    return (
        <table style={{ width: "100%", marginTop: "20px" }}>
            <thead>
            <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Departamento ID</th>
                <th>Acciones</th>
            </tr>
            </thead>
            <tbody>
            {carreras.map((car) => (
                <tr key={car.id}>
                    <td>{car.id}</td>
                    <td>{car.nombre}</td>
                    <td>{car.departamento}</td>
                    <td>
                        <button onClick={() => onEdit(car)}>✏️ Editar</button>
                        <button onClick={() => onDelete(car.id)}>❌ Eliminar</button>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    )
}
