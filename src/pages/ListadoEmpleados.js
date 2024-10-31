import  React,{useState, useEffect} from 'react';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import axios from 'axios'
import { useNavigate } from "react-router-dom";
function ListadoEmpleados() {
  const navigate = useNavigate();
  const handleVolver = () => {
    navigate('/MenuRRHH');
  }
  const [selectedRowId, setSelectedRowId] = React.useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [mostrarModif, setmostrarModif] = useState(false);
const initialInputValues = {
  id_empleado:0,
  nombre_empleado:'',
  apellido_empleado: '',
  antiguedad: '',
  usuario: '',
  clave: ''
};
const [inputs, setInputs] = useState(initialInputValues);
const [lista,setLista]=useState([])
const handleInputChange = (event) => {
  const { name, value } = event.target; setInputs({ ...inputs, [name]: value });
  console.log(event.target, event.value)
};
useEffect(() => {
  handleLista(); // Llama a la función al cargar el componente
}, []);

const handleLista=async ()=>{ 
  try {
    const {data} = await axios.get('http://localhost:3001/listaEmpleados');
    if (data.success) {
      console.log('Se cargaron los datos exitosamente');
      console.log(data.empleados)
      setLista(data.empleados); 
      
    } else {
      setErrorMessage(data.message || 'Error en la creación del empleado');

    }
  } catch (error) {
    setErrorMessage('Error en la autenticación. Inténtalo de nuevo.');

  }
}
const handlleModificarUsuario= async ()=>{
  console.log(inputs.id_empleado)
  try {
    const replic = await axios.post('http://localhost:3001/ModificarEmpleado',{
      empleadoId:inputs.id_empleado,
      name:inputs.nombre_empleado, 
      lastName:inputs.apellido_empleado,
      antiguedad:inputs.antiguedad,
      user:inputs.usuario,
      password:inputs.clave
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
const handleEliminarUsuario=async (id)=>{
  console.log(id)
 try {
    const replicate = await axios.post('http://localhost:3001/EliminarEmpleado',{EmpleadoId:id});
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


  const handleRowClick = (row) => {
    alert('se hizo click en la celda '+ row.id_empleado)
  }
  return (
    <div>
      <table style={{backgroundColor:'lightpink'}} className='tabla-peticiones'>
        <thead>
          <tr >
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Usuario</th>
            <th>Contraseña</th>
          </tr>
        </thead>
        <tbody >
        {lista.map((row) => ( 
          <TableRow key={row.id_empleado} onClick={() => handleRowClick(row)} style={{ cursor: 'pointer'}} className='file-employees'> 
          <TableCell>{row.nombre_empleado}</TableCell> 
          <TableCell>{row.apellido_empleado}</TableCell> 
          <TableCell>{row.usuario}</TableCell> 
          <TableCell>{row.clave}</TableCell> 
          <button style={{margin:'0 2rem'}} onClick={(e) => { e.stopPropagation();setmostrarModif(true); setInputs(row)}}>Modificar usuario</button>
          <button onClick={(e) => { e.stopPropagation(); handleEliminarUsuario(row.id_empleado); }}>Eliminar usuario</button>
          </TableRow> ))
          }
        </tbody>
      </table>
   
      <div style={{ margin: '1rem', padding:'2rem'}}>
        
        <button onClick={handleLista}>Ver lista</button>
        <button style={{ margin: '0 2rem' }} onClick={handleVolver}>Volver</button>
      </div>
 
      <div>
      {mostrarModif  && (<div>
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
          <label htmlFor='antiguedad'>Antiguedad:
            <input
              type="number"
              name="antiguedad"
              onChange={handleInputChange}
              value={inputs.antiguedad}
              required />
          </label>
        </div>
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