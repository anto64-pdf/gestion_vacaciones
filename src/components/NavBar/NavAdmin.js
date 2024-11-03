import React, { useState } from 'react'
import { AppBar } from '@mui/material/'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { Box, Button } from '@mui/material'
import '../../estilos/navBar.css';
import { pink } from 'material-ui-colors';
import { Link } from 'react-router-dom'
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Badge from '@mui/material/Badge';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import IconButton from '@mui/material/IconButton';
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreIcon from '@mui/icons-material/MoreVert';
import { useNavigate } from "react-router-dom";
//npm install material-ui-colors
const color = pink[500];

function NavAdmin() {
  let user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  if (localStorage.getItem('user') === null) {
    navigate('/');
    alert('No ingreso si cuenta vuelva a intentarlo')

  }

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLogout = () => {
    localStorage.removeItem('user')
    navigate('/');
  }
  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}> <Link to="/MenuRRHH" preventScrollReset={true}><Button color='inherit' style={{ backgroundColor: 'inherit' }}>Inicio</Button></Link></MenuItem>
      <MenuItem onClick={handleMenuClose}><Link to="/DatosRRHH" preventScrollReset={true}><Button color='inherit' style={{ backgroundColor: 'inherit' }}>Mis Datos</Button></Link></MenuItem>
      <MenuItem onClick={() => { handleMenuClose(); handleLogout() }}><Link to="/" preventScrollReset={true}><Button color='inherit' style={{ backgroundColor: 'inherit' }}>Cerrar sesion</Button></Link></MenuItem>
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>

      </MenuItem>
    </Menu>
  );

  return (
    <div className='navBar'>
      <AppBar position='static' style={{ backgroundColor: color }}> {/*le doy color mediante la variable*/}

        <Toolbar>
          <Typography className='navBarName' variant='h6' component='div' sx={{ flexGrow: 1 }}>{user.nombre_administrador} {user.apellido_administrador}</Typography>
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>

            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
          </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Box>
          <Box>


            <Link to="/ListaPedidos" preventScrollReset={true}><Button color='inherit'>Lista Pedidos</Button></Link>
            <Link to="/AltaEmpleado" preventScrollReset={true}><Button color='inherit'>Alta Empleados</Button></Link>
            <Link to="/ListaEmpleados" preventScrollReset={true}><Button color='inherit'>Lista Empleados</Button></Link>
          </Box>
        </Toolbar>
        {renderMobileMenu}
        {renderMenu}
      </AppBar>
    </div>
  )
}

export default NavAdmin
