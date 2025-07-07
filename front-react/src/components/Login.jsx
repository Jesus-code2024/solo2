import React, { useState } from 'react';
import { FaGoogle, FaEnvelope } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import EmailLoginForm from './EmailLoginForm';

import { Navbar, Container } from 'react-bootstrap';


import tecsupLogoHeader from '../assets/Tecsup-sinbackground.png'; 
import tecsupLogoMain from '../assets/logo-tec.png'; 
import loginBackground from '../assets/loginBackground';

function AuthPage() {
  const [showEmailForm, setShowEmailForm] = useState(false);
  const navigate = useNavigate();

  const handleGoogleLogin = () => {


        const frontendRedirectUri = 'http://localhost:3000/oauth2/redirect'; 
        
  
        const authorizationUrl = `http://localhost:8080/oauth2/authorize/google?redirect_uri=${encodeURIComponent(frontendRedirectUri)}`;

        // Redirige el navegador a la URL construida
        window.location.href = authorizationUrl;
  };

  const handleEmailLoginClick = () => {
    setShowEmailForm(true);
  };

  const handleBackToOptions = () => {
    setShowEmailForm(false);
  };

  return (
    <div
      className="auth-page-container min-vh-100 d-flex flex-column justify-content-center align-items-center"
      style={{
        background: `url(${loginBackground}) center/cover no-repeat fixed`,
        minHeight: '100vh',
        width: '100vw',
        position: 'relative',
      }}
    >
      <div className="institutional-login-card shadow-lg rounded-4 p-4" style={{ maxWidth: 420, width: '100%', background: 'rgba(255,255,255,0.97)' }}>
        <div className="text-center mb-4">
          <img src={tecsupLogoHeader} alt="Tecsup Logo" style={{ height: 60, marginBottom: 12 }} />
          <h3 className="fw-bold mt-2 mb-0" style={{ color: '#003366', letterSpacing: 1 }}>Portal de Eventos Tecsup</h3>
          <div className="text-secondary mb-2" style={{ fontSize: 15 }}>Acceso institucional</div>
        </div>
        <hr className="mb-4" />
        <div className="d-flex flex-column align-items-center">
          {!showEmailForm ? (
            <>
              <img src={tecsupLogoMain} alt="Logo Tecsup" style={{ height: 80, marginBottom: 18 }} />
              <h5 className="mb-4 fw-semibold" style={{ color: '#003366' }}>Inicia sesión para continuar</h5>
              <button
                className="btn btn-outline-primary w-100 mb-3 d-flex align-items-center justify-content-center gap-2 py-2"
                style={{ fontWeight: 500, fontSize: 17, borderRadius: 8, borderWidth: 2 }}
                onClick={handleGoogleLogin}
              >
                <FaGoogle className="icon me-2" style={{ fontSize: 20 }} />
                Continúa con Google
              </button>
              <button
                className="btn btn-outline-secondary w-100 mb-2 d-flex align-items-center justify-content-center gap-2 py-2"
                style={{ fontWeight: 500, fontSize: 17, borderRadius: 8, borderWidth: 2 }}
                onClick={handleEmailLoginClick}
              >
                <FaEnvelope className="icon me-2" style={{ fontSize: 20 }} />
                Continúa con tu email
              </button>
            </>
          ) : (
            <>
              <button
                className="btn btn-link text-primary mb-3 align-self-start"
                style={{ fontWeight: 500, fontSize: 16 }}
                onClick={handleBackToOptions}
              >
                &larr; Volver
              </button>
              <div className="w-100">
                <EmailLoginForm />
              </div>
            </>
          )}
        </div>
      </div>
      <div className="text-center mt-4 text-muted" style={{ fontSize: 13 }}>
        &copy; {new Date().getFullYear()} Tecsup. Todos los derechos reservados.
      </div>
    </div>
  );
}

export default AuthPage;