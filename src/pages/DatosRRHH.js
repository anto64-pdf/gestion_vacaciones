import * as React from 'react';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import List from '@mui/material/List';
import { FixedSizeList } from 'react-window';
import { useNavigate } from "react-router-dom";
import '../estilos/datos.css'

function render() {
  let user = JSON.parse(localStorage.getItem('user'));
  return (
    <List className='lista'>
      <ListItem key={user.id_empleado} component="div" title='name'>
        <ListItemText primary='Nombre: ' />
        <ListItemText primary={user.nombre_administrador} />
      </ListItem>
      <ListItem >
        <ListItemText primary='Apellido: ' />
        <ListItemText primary={user.apellido_administrador} />
      </ListItem>
      <ListItem >
        <ListItemText primary='Usuario: ' />
        <ListItemText primary={user.usuario} />
      </ListItem>
      <ListItem>
        <ListItemText primary='Clave: ' />
        <ListItemText primary={user.clave} />
      </ListItem>
    </List>
  )
}
function DatosRRHH() {
  const navigate = useNavigate(); 
  const handleVolver=()=>{
    navigate('/MenuRRHH'); 
  }
  return (
    <div className='container' >
      <h1>Mis Datos</h1>
      <div   className='box-list' >
        <FixedSizeList
        className='scroll'
        style={{backgroundColor:'lightpink', borderRadius:'10px'}}
          height={200}
          width={360}
          itemSize={46}
          itemCount={1}
          overscanCount={5}
        >
          {render}
        </FixedSizeList>
      </div>
      <button onClick={handleVolver}>Volver</button>
    </div>
  )
}

export default DatosRRHH