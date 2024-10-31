import React, {useState} from 'react'
import { AppBar } from '@mui/material/'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { Box, Button } from '@mui/material'
import  '../../estilos/navBar.css';
import { pink } from 'material-ui-colors';
import {Link} from 'react-router-dom'
//npm install material-ui-colors
const color = pink[500];

function NavAdmin() {
  let user = JSON.parse(localStorage.getItem('user'));
  return (
    <div className='navBar'>
      <AppBar position='static' style={{backgroundColor:color}}> {/*le doy color mediante la variable*/}
        
        <Toolbar>
          <Typography className='navBarName' variant='h6' component='div' sx={{ flexGrow: 1 }}>{user.nombre_administrador} {user.apellido_administrador}</Typography>
          <Box>
            <Link to="/MenuRRHH" preventScrollReset = {true}><Button color='inherit'>Inicio</Button></Link>
            <Link to="/DatosRRHH" preventScrollReset = {true}><Button color='inherit'>Mis Datos</Button></Link>
           <Link to="/ListaPedidos" preventScrollReset = {true}><Button color='inherit'>Lista Pedidos</Button></Link>   
            <Link to="/AltaEmpleado" preventScrollReset = {true}><Button color='inherit'>Alta Empleados</Button></Link>
            <Link to="/ListaEmpleados" preventScrollReset = {true}><Button color='inherit'>Lista Empleados</Button></Link>
          </Box>
        </Toolbar>
      </AppBar>
    </div>
  )
}

export default NavAdmin
