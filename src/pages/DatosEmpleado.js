import react, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import List from '@mui/material/List';
import { FixedSizeList } from 'react-window';
import { useNavigate } from "react-router-dom";
import axios from 'axios'
import moment from 'moment';
// function Render(diasRestantes) {
//   let user = JSON.parse(localStorage.getItem('user'));

//   return (

//   )
// }
function DatosEmpleado() {
  const navigate = useNavigate();
  let user = JSON.parse(localStorage.getItem('user'));
  const handleVolver = () => {
    navigate('/MenuEmpleado');
  }
  const [diasRestantes, setDiasRestantes] = useState(0);
  const DiasRestantes = async () => {
    try {
      const results = await axios.post('http://localhost:3001/DiasRestantesEmpleado', { empleadoId: user.id_empleado });
      if (results.data.success) {
        setDiasRestantes(results.data.dias.cant_dias_vacaciones);

        console.log(diasRestantes)
        console.log('Se cargaron los datos')
      }
      else {
        console.log('Credenciales incorretas');
      }
    }
    catch (error) {
      console.error('Error en la autenticación:', error.message);
    }
  }
  useEffect(() => {
    DiasRestantes()
  }, [])

   let fechaIngreso = new Date(user.fecha_ingreso);
   console.log(fechaIngreso)
   let fechaActual = moment(new Date());
   let antiguedad = fechaActual.diff(fechaIngreso, 'years');

  const renderRow = ({ index, style }) => {
    const data = [
      { label: 'Nombre', value: user.nombre_empleado },
      { label: 'Apellido', value: user.apellido_empleado },
      { label: 'Antigüedad', value: antiguedad },
      {label: 'Fecha Ingreso', value:new Date(user.fecha_ingreso).toLocaleDateString()},
      { label: 'Limite Vacaciones', value: diasRestantes }, // Aquí muestras los días restantes
      { label: 'Usuario', value: user.usuario },
      { label: 'Clave', value: user.clave }
    ];
    
    return (
      <ListItem style={style} key={index}>
        <ListItemText primary={`${data[index].label}:`} />
        <ListItemText primary={data[index].value} />
      </ListItem>
    );
  };
  return (
    <div style={{ backgroundColor: 'lightpink', height: '30rem', width: '40rem', borderRadius: '20px' }}>
      <h1>Mis Datos</h1>
      <Box
        sx={{ width: '100%', height: 200, maxWidth: 360, bgcolor: 'background.paper', border: 'black solid 1px', margin: '20% auto', borderRadius: '10px' }}
      >
        <FixedSizeList
          height={200}
          width={360}
          itemSize={46}
          itemCount={6} 
          overscanCount={5}
        >
         {renderRow}
        </FixedSizeList>
      </Box>
      <button onClick={handleVolver}>Volver</button>
    </div>
  )
}

export default DatosEmpleado