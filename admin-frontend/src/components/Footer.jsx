export default function Footer() {
    return (
        <footer style={styles.footer}>
            <p>&copy; {new Date().getFullYear()} Proyecto Integrador - Administración</p>
        </footer>
    )
}

const styles = {
    footer: {
        textAlign: "center",
        padding: "1rem",
        backgroundColor: "#f0f0f0",
        color: "#333",
        position: "fixed",
        bottom: 0,
        width: "100%",
        fontSize: "0.9rem",
        borderTop: "1px solid #ddd"
    }
}
