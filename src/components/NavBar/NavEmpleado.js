import React, {useState} from 'react'
import { AppBar } from '@mui/material/'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { Box, Button } from '@mui/material'
import  '../../estilos/navBar.css';
import { pink } from 'material-ui-colors';
import {Link} from 'react-router-dom'
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
//npm install material-ui-colors
const color = pink[500];
function NavEmpleado() {
 let user = JSON.parse(localStorage.getItem('user'));
  return (
    <div className='navBar'>
      <AppBar position='static' style={{backgroundColor:color}}> {/*le doy color mediante la variable*/}
        
        <Toolbar>
          <Typography className='navBarName' variant='h6' component='div' sx={{ flexGrow: 1 }}>{user.nombre_empleado} {user.apellido_empleado}</Typography>
          <Box>
            <Link to="/" preventScrollReset = {true}><Button color='inherit'>Cerrar sesion</Button></Link>
            <Link to="/DatosEmpleado" preventScrollReset = {true}><Button color='inherit'>Datos</Button></Link>
           <Link to="/PedidosEmpleado" preventScrollReset = {true}><Button color='inherit'>Pedido</Button></Link>   
            <Link to="/EstadoPedido" preventScrollReset = {true}><Button color='inherit'>Estado</Button></Link>
          </Box>
        </Toolbar>
      </AppBar>
    </div>
  )
}

export default NavEmpleado