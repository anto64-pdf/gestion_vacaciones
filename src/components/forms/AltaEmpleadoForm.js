import React, { useState } from 'react'
import '../../estilos/altaform.css'
import axios from 'axios'
import { useNavigate } from "react-router-dom";
import moment from 'moment';
function AltaEmpleadoForm() {
  let existe = false;

  const navigate = useNavigate();
  const handleVolver = () => {
    navigate('/MenuRRHH');
  }
  const inputValues = {
    name: '',
    lastName: '',
    fechaIngreso: new Date(),
    user: '',
    password: '',
    cargo: ''
  };
  const [inputs, setInputs] = useState(inputValues);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const cantidadLimite = () => {
    let limiteDias = 0;
    let fecha_ingreso = inputs.fechaIngreso;
    let fechaActual = moment(new Date());
    let antiguedad = fechaActual.diff(fecha_ingreso, 'years');
    if (antiguedad > 20) {
      limiteDias = 35;
    }
    else if (antiguedad > 10 && antiguedad <= 20) {
      limiteDias = 28;
    }
    else if (antiguedad > 5 && antiguedad <= 10) {
      limiteDias = 21;
    }
    else if (antiguedad >= 1 && antiguedad <= 5) {
      limiteDias = 14;
    }
    return limiteDias;
  }

  const handleInputChange = (event) => {
    const { name, value } = event.target; setInputs({ ...inputs, [name]: value });
  };
  const handleSubmit = async (event) => {
    event.preventDefault(); setLoading(true);
    try {
      const response = await axios.post('http://localhost:3001/loginEmpleado',
        { user: inputs.user, password: inputs.password });
      if (response.data.success) {
        alert('Ese usuario ya existe');
        setInputs(inputValues)
      }
      else {
        console.log('No existe ese usuario');
        try {
          const response = await axios.post('http://localhost:3001/createEmployee',
            {
              name: inputs.name,
              lastname: inputs.lastName,
              ingreso: inputs.fechaIngreso,
              user: inputs.user,
              password: inputs.password,
              cargo: inputs.cargo,
              diasVacaciones: cantidadLimite()
            });
          if (response.data.success) {
            alert('Se cargaron los datos exitosamente');
            setInputs(inputValues); // Resetear los inputs 
          } else {
            setErrorMessage(response.data.message || 'Error en la creación del empleado');

          }
        } catch (error) {
          setErrorMessage('Error en la autenticación. Inténtalo de nuevo.');

        }
        finally {
          setLoading(false);
        }

      }
    }
    catch (error) {
      console.error('Error en la autenticación:', error.message);
    }
  };

  const handleDateChange = (fecha) => {
    setInputs({
      ...inputs,
      fechaIngreso: fecha.target.value
    });
  };
  return (
    <div>
      <h1>Dar alta empleado</h1>
      <form onSubmit={handleSubmit} className='alta-empleado'>
        <div >
          <label htmlFor='name'>Nombre:
            <input
              type="text"
              name="name"
              onChange={handleInputChange}
              value={inputs.name}
              required />
          </label>
        </div>
        <div >
          <label htmlFor='lastName'>Apellido:
            <input
              type="text"
              name="lastName"
              onChange={handleInputChange}
              value={inputs.lastName}
              required />
          </label>
        </div>
        <div >
          <label htmlFor='ingreso'>Fecha Ingreso:
            <input
              type="date"
              name="ingreso"
              onChange={handleDateChange}
              value={inputs.fechaIngreso}
              style={{ textAlign: 'center' }}
              required />
          </label>
        </div>
        {console.log(inputs.fechaIngreso)}
        <div >
          <label htmlFor='cargo'>Departamento:
            <input
              type="text"
              name="cargo"
              onChange={handleInputChange}
              value={inputs.cargo}
              required />
          </label>
        </div>
        <div >
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
          <button onClick={handleVolver} style={{ margin: '1rem 3rem' }}>Volver</button>
          <button type="submit" value="Enviar" >Enviar</button>
        </div>
      </form>

    </div>
  )
}

export default AltaEmpleadoForm