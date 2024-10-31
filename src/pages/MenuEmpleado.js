import React from 'react'
import NavEmpleado from '../components/NavBar/NavEmpleado'
import EstadoPeticion from './EstadoPeticion'
import DatosEmpleado from './DatosEmpleado'
import VacacionesPedidoForm from '../components/forms/VacacionesPedidoForm'
function MenuEmpleado() {
  let user = JSON.parse(localStorage.getItem('user'));
  return (
   
    <div>
      <NavEmpleado />
      Bienvenido {user.nombre_empleado}


      </div>
  )
}

export default MenuEmpleado