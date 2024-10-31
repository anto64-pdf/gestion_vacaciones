import * as React from 'react';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import List from '@mui/material/List';
import { FixedSizeList } from 'react-window';
import { useNavigate } from "react-router-dom";

function render() {
  let user = JSON.parse(localStorage.getItem('user'));
  return (
    <List >
      <ListItem style={{border:'black solid 1px'}}key={user.id_empleado} component="div" title='name'>
        <ListItemText primary='Nombre: ' />
        <ListItemText primary={user.nombre_administrador} />
      </ListItem>
      <ListItem style={{border:'black solid 1px'}}>
        <ListItemText primary='Apellido: ' />
        <ListItemText primary={user.apellido_administrador} />
      </ListItem>
      <ListItem style={{border:'black solid 1px'}}>
        <ListItemText primary='Usuario: ' />
        <ListItemText primary={user.usuario} />
      </ListItem>
      <ListItem style={{border:'black solid 1px'}}>
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
    <div style={{backgroundColor:'lightpink', height:'30rem', width:'40rem', borderRadius:'20px'}}>
      <h1>Mis Datos</h1>
      <Box
        sx={{ width: '100%', height: 200, maxWidth: 360, bgcolor: 'background.paper', border:'black solid 1px', margin:'20% auto', borderRadius:'10px' }}
      >
        <FixedSizeList
          height={200}
          width={360}
          itemSize={46}
          itemCount={1}
          overscanCount={5}
        >
          {render}
        </FixedSizeList>
      </Box>
      <button onClick={handleVolver}>Volver</button>
    </div>
  )
}

export default DatosRRHH