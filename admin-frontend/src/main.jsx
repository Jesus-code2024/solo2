import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import {BrowserRouter} from 'react-router-dom'
import '../../../Back-End1/admin-frontend/src/assets/styles.css'
import axios from "axios"

const token = localStorage.getItem("token")
if (token) {
    axios.defaults.headers.common["Authorization"] = `Token ${token}`
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <App />
    </BrowserRouter>
)
