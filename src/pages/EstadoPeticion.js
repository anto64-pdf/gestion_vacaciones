import React,{useState, useEffect} from 'react'
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import axios from 'axios'
import { useNavigate } from "react-router-dom";
function EstadoPeticion() {
  const [peticion, setPeticion]=useState([])

  useEffect(() => {
    handlePeticion()
  }, []);

  const navigate = useNavigate(); 
  const handleVolver=()=>{
    navigate('/MenuEmpleado'); 
  }

  const handlePeticion=async ()=>{ 
    let user = JSON.parse(localStorage.getItem('user'));
    console.log(user.id_empleado)
    try {
      const {data} = await axios.post('http://localhost:3001/EstadoPeticion',{empleadoId:user.id_empleado});
      if (data.success) {
        console.log('Se cargaron los datos exitosamente');
        setPeticion(data.peticiones); 
        
      } else {
        console.log(data.message || 'Error en la creación del empleado');
  
      }
    } catch (error) {
      console.log('Error en la autenticación. Inténtalo de nuevo.');
  
    }
  }

  return (
    <div>
       <table style={{ backgroundColor: 'lightpink' }} className='tabla-peticiones'>
        <thead>
          <tr >
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Estado</th>
            <th>Desde</th>
            <th>Hasta</th>
            <th>Total Dias</th>
          </tr>
        </thead>
        <tbody >
          {peticion.map((row) => (
            <TableRow key={row.id_peticion}  style={{ cursor: 'pointer', textAlign:'center'}} className='file-peticiones'>
              <TableCell>{row.nombre_empleado}</TableCell>
              <TableCell>{row.apellido_empleado}</TableCell>
              <TableCell>{row.estado}</TableCell>
              <TableCell>{new Date(row.fecha_Inicio).toLocaleDateString()}</TableCell>
              <TableCell>{new Date(row.fecha_fin).toLocaleDateString()}</TableCell>
              <TableCell>{row.cant_dias}</TableCell>
            </TableRow>))}
        </tbody>
      </table>
      <button style={{width:'5rem',margin:'2rem'}} onClick={handleVolver}>Volver</button>
    </div>
  )
}

export default EstadoPeticion