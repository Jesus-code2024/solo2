export default function DepartamentoList({ departamentos, onEdit, onDelete }) {
    if (!departamentos || departamentos.length === 0) {
        return <p>No hay departamentos registrados.</p>
    }

    return (
        <table style={{ width: "100%", marginTop: "20px" }}>
            <thead>
            <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Acciones</th>
            </tr>
            </thead>
            <tbody>
            {departamentos.map((dep) => (
                <tr key={dep.id}>
                    <td>{dep.id}</td>
                    <td>{dep.nombre}</td>
                    <td>
                        <button onClick={() => onEdit(dep)}>✏️ Editar</button>
                        <button onClick={() => onDelete(dep.id)}>❌ Eliminar</button>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    )
}
