export default function TipoEventoList({ tipos, onEdit, onDelete }) {
    if (!tipos || tipos.length === 0) {
        return <p>No hay tipos registrados.</p>
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
            {tipos.map((tipo) => (
                <tr key={tipo.id}>
                    <td>{tipo.id}</td>
                    <td>{tipo.nombre}</td>
                    <td>
                        <button onClick={() => onEdit(tipo)}>✏️ Editar</button>
                        <button onClick={() => onDelete(tipo.id)}>❌ Eliminar</button>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    )
}
