import React, { useState, useEffect } from "react";
import 'semantic-ui-css/semantic.min.css';
import '../../estilos/loginForm.css'
import axios from 'axios';
function LoginForm({ onLoginSuccess }) {

  const inputValues = {
    user: '',
    password: '',
    rol: '',
    checked: false
  }
  const [loading, setLoading] = useState(false);
  const [inputs, setInputs] = useState(inputValues);
  const [errorMessage, setErrorMessage] = useState("");


  const handleInputChange = (event) => {
    const { name, type, value, checked } = event.target;
    setInputs({ ...inputs, [event.target.name]: event.target.value, [name]: type === 'checkbox' ? checked : value, })
   
  }



  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    if (inputs.rol == 'Empleado') {
      try {
        const response = await axios.post('http://localhost:3001/loginEmpleado', 
          { user: inputs.user, password: inputs.password });
        if (response.data.success) {
          console.log('Login exitoso');
          onLoginSuccess(response.data.user, inputs.rol);
          setErrorMessage("");
        }
        else {
          console.log('Credenciales incorrectas');
          setErrorMessage('Usuario o contraseña incorrectos');
        }
      }
      catch (error) {
        console.error('Error en la autenticación:', error.message);
        setErrorMessage('Error en la autenticación. Inténtalo de nuevo.');
      }

      finally { setLoading(false); }
    } else {
      try {
        const response = await axios.post('http://localhost:3001/loginAdministrador', { user: inputs.user, password: inputs.password });
        if (response.data.success) {
          console.log('Login exitoso');
          //localStorage.setItem('user', JSON.stringify(response.data.user));
          onLoginSuccess(response.data.user, inputs.rol);
          setErrorMessage("");
        }
        else { console.log('Credenciales incorrectas'); 
          setErrorMessage('Usuario o contraseña incorrectos'); }
      }
      catch (error) {
        console.error('Error en la autenticación:', error.message);
        setErrorMessage('Error en la autenticación. Inténtalo de nuevo.');
      }

      finally { setLoading(false); }
    }

  }

  return (
    <div >
      <form onSubmit={handleSubmit}>
        <div >
          <label htmlFor='user'>Nombre de usuario:
            <input
              type="text"
              name="user"
              onChange={handleInputChange}
              value={inputs.user}
              required />
          </label>
        </div>
        <div >
          <label htmlFor='password'>Contraseña:
            <input
              type="password"
              name="password"

              onChange={handleInputChange}
              value={inputs.password}
              required />
          </label>
        </div>


        <div >
          <div><label htmlFor='rol'> Rol:  </label></div>
          <select name="rol" value={inputs.rol} onChange={handleInputChange}>
            <option name='rol' value='' ></option>
            <option name='rol' value='Empleado' >Empleado</option>
            <option name='rol' value='RRHH' >RRHH</option>
          </select>
        </div>
        <label>
          <input
            name="checked"
            type="checkbox"
            value={inputs.checked}
            defaultChecked={inputs.checked}
            onChange={handleInputChange}
            required
          />{" "}
          Not a robot?
        </label>
        <div>
          {errorMessage && (<div style={{color:'red'}}>{errorMessage}</div>)}
          <button type="submit" value="Ingresar" >Ingresar</button>
        </div>


      </form>

    </div>)
};

export default LoginForm;