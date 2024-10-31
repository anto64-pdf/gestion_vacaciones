
import { useNavigate } from "react-router-dom";
import React, { useState,useEffect } from "react";
import LoginForm from '../components/forms/LoginForm'
import '../estilos/loginForm.css';

function LoginPage() {
  const [errorMessage, setErrorMessage] = useState(""); 
  const navigate = useNavigate(); 
  const handleLoginSuccess = (user, rol) => 
    { 
      if(rol=='Empleado'){
        navigate('/MenuEmpleado'); 
      }
      else{
        navigate('/MenuRRHH'); 
      }
      localStorage.setItem('user', JSON.stringify(user)); 
      console.log("Bienvenido", user.usuario); 
      
    }
    


  return (
    <div className="login-page">
    <h1>Iniciar Sesión</h1> 
    {errorMessage && <div className="error-message">{errorMessage}</div>} 
    <LoginForm onLoginSuccess={handleLoginSuccess} />
    </div>
  );
}

export default LoginPage;