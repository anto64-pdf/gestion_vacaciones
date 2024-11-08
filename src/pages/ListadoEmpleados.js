import React, { useState, useEffect } from 'react';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import axios from 'axios'
import { useNavigate } from "react-router-dom";
import '../estilos/tabla.css'
import moment from 'moment';


function ListadoEmpleados() {
  const navigate = useNavigate();
  const handleVolver = () => {
    navigate('/MenuRRHH');
  }
  const [selectedRowId, setSelectedRowId] = React.useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [mostrarModif, setmostrarModif] = useState(false);
  const initialInputValues = {
    name: '',
    lastName: '',
    fecha_ingreso: new Date(),
    user: '',
    password: '',
    cargo: '',
    diasRestantes: ''
  };

  const [inputs, setInputs] = useState(initialInputValues);
  const [lista, setLista] = useState([])
  let antiguedad=0;
  const handleInputChange = (event) => {
    const { name, value } = event.target; setInputs({ ...inputs, [name]: value });
    console.log(event.target, event.value)
  };
  useEffect(() => {
    handleLista(); // Llama a la función al cargar el componente
  }, []);

  const handleLista = async () => {
    try {
      const { data } = await axios.get('http://localhost:3001/listaEmpleados');
      if (data.success) {
        console.log('Se cargaron los datos exitosamente');
        console.log('lista'+data.empleados)
        setLista(data.empleados);

      } else {
        setErrorMessage(data.message || 'Error en la creación del empleado');

      }
    } catch (error) {
      setErrorMessage('Error en la autenticación. Inténtalo de nuevo.');

    }
  }
  const handlleModificarUsuario = async () => {
    console.log(inputs.id_empleado)
    try {
      const replic = await axios.post('http://localhost:3001/ModificarEmpleado', {
        empleadoId: inputs.id_empleado,
        name: inputs.nombre_empleado,
        lastName: inputs.apellido_empleado,
        restoDias: cantidadLimite(),
        ingreso: inputs.fecha_ingreso,
        user: inputs.usuario,
        password: inputs.clave
      });
      if (replic.data.success) {
        console.log('Se eliminaron los datos exitosamente');
        setmostrarModif(false)
        handleLista();

      } else {
        console.log(replic.data.message || 'Error en la creación del empleado');

      }
    } catch (error) {
      console.log('Error en la autenticación. Inténtalo de nuevo.');

    }
  }
  const handleEliminarUsuario = async (id) => {
    console.log(id)
    try {
      const replicate = await axios.post('http://localhost:3001/EliminarEmpleado', { EmpleadoId: id });
      if (replicate.data.success) {
        console.log('Se eliminaron los datos exitosamente');
        handleLista();

      } else {
        console.log(replicate.data.message || 'Error en la creación del empleado');

      }
    } catch (error) {
      console.log('Error en la autenticación. Inténtalo de nuevo.');

    }
  }


  const mostrarAntiguedad=(fecha_ingreso)=>{
    let fechaIngreso = new Date(fecha_ingreso);
   let fechaActual = moment(new Date());
    antiguedad = fechaActual.diff(fechaIngreso, 'years');
  }

  const cantidadLimite = () => {
    let limiteDias=0
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
  const handleRowClick = (row) => {
    alert('se hizo click en la celda ' + row.id_empleado)
  }

  const handleDateChange = (fecha) => {
    setInputs({
      ...inputs,
      fecha_ingreso: fecha.target.value
    });
  };

  return (
    <div>
      <table style={{ backgroundColor: 'lightpink' }} className='tabla-peticiones'>
        <thead >
          <tr>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Antiguedad</th>
            <th>Departamento</th>
            <th>Dias Restantes Vacaciones</th>
            <th>Usuario</th>
            <th>Contraseña</th>
          </tr>
        </thead>
        <tbody>
          {lista.map((row) => (
            <tr key={row.id_empleado} onClick={() => handleRowClick(row)} style={{ cursor: 'pointer' }} className='file-employees'>
              <td >{row.nombre_empleado}</td>
              <td >{row.apellido_empleado}</td>
              {mostrarAntiguedad(row.fecha_ingreso)}
              <td >{antiguedad}</td>
              <td >{row.departamento}</td>
              <td >{row.cant_dias_vacaciones}</td>
              <td >{row.usuario}</td>
              <td >{row.clave}</td>
              <button style={{ margin: '0 2rem' }} onClick={(e) => { e.stopPropagation(); setmostrarModif((prev) => !prev); setInputs(row) }}>Modificar usuario</button>
              <button onClick={(e) => { e.stopPropagation(); handleEliminarUsuario(row.id_empleado); }}>Eliminar usuario</button>
            </tr>))
          }
        </tbody>
      </table>

      <div style={{ margin: '1rem', padding: '2rem' }}>

        <button onClick={handleLista}>Ver lista</button>
        <button style={{ margin: '0 2rem' }} onClick={handleVolver}>Volver</button>
      </div>

      <div>
        {mostrarModif && (<div>
          <form onSubmit={handlleModificarUsuario} className='alta-empleado'>
            <div >
              <label htmlFor='nombre_empleado'>Nombre:
                <input
                  type="text"
                  name="nombre_empleado"
                  onChange={handleInputChange}
                  value={inputs.nombre_empleado}
                  required />
              </label>
            </div>
            <div >
              <label htmlFor='apellido_empleado'>Apellido:
                <input
                  type="text"
                  name="apellido_empleado"
                  onChange={handleInputChange}
                  value={inputs.apellido_empleado}
                  required />
              </label>
            </div>

            <div >
             
              <label htmlFor='ingreso'>Fecha Ingreso:
              {/* {' ('+new Date(inputs.fecha_ingreso).toISOString().split('T')[0]+')'} */}
                <input
                  type="date"
                  name="ingreso"
                  onChange={handleDateChange}
                  contentEditable
                  max={new Date()}
                  value={new Date(inputs.fecha_ingreso).toISOString().split('T')[0]}
                  //placeholder={new Date(inputs.fecha_ingreso).toISOString().split('T')[0]}
                  required />
              </label>
            </div>
            {console.log(new Date(inputs.fecha_ingreso).toISOString())}
            <div >
              <label htmlFor='usuario'>Nombre de usuario:
                <input
                  type="text"
                  name="usuario"
                  onChange={handleInputChange}
                  value={inputs.usuario}
              
                  required />
              </label>
            </div>
            <div >
              <label htmlFor='clave'>Contraseña:
                <input
                  type="password"
                  name="clave"

                  onChange={handleInputChange}
                  value={inputs.clave}
                  required />
              </label>
            </div>
            <div >
              <button type="submit" value="Enviar" >Enviar</button>
            </div>


          </form>
        </div>)}
      </div>

    </div>
  )
}
//1. Traer todos los pedidos (consulta - select)
//2. Al presionar aceptar se debería cambiar el estado a aceptado (update)
//3. Al presionar rechazar se deberia cambiar el estado a rechazado (update)
export default ListadoEmpleados