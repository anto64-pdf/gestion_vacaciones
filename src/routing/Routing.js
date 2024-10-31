import React from 'react'
import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import LoginPage from '../pages/LoginPage';
import MenuEmpleado from '../pages/MenuEmpleado'
import MenuRRHH from '../pages/MenuRRHH'
import DatosEmpleado from '../pages/DatosEmpleado';
import VacacionesPedidoForm from '../components/forms/VacacionesPedidoForm'
import EstadoPeticion from '../pages/EstadoPeticion'
import DatosRRHH from '../pages/DatosRRHH'
import ListaPeticiones from '../pages/ListaPeticiones'
import AltaEmpleadoForm from '../components/forms/AltaEmpleadoForm'
import NavEmpleado from '../components/NavBar/NavEmpleado';
import NavAdmin from '../components/NavBar/NavAdmin';
import ListadoEmpleados from '../pages/ListadoEmpleados'
function Routing() {
  return (
    <Router>
      <Routes>
        <Route exact path='/' element={<LoginPage />} />
        <Route   path='/MenuEmpleado' element={<MenuEmpleado />} />
        <Route   path='/DatosEmpleado' element={<DatosEmpleado />} />
        <Route  path='/PedidosEmpleado' element={<VacacionesPedidoForm />} />
        <Route  path='/EstadoPedido' element={<EstadoPeticion />} />

        <Route path='/MenuRRHH' element={<MenuRRHH />} />
        <Route  path='/DatosRRHH' element={<DatosRRHH />} />
        <Route  path='/ListaPedidos' element={<ListaPeticiones />} />
        <Route  path='/AltaEmpleado' element={<AltaEmpleadoForm />} />
        <Route  path='/ListaEmpleados' element={<ListadoEmpleados />} />
      </Routes>
    </Router>
  )
}

export default Routing