import React, { useState, useEffect } from 'react';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import axios from 'axios'
import { useNavigate } from "react-router-dom";
function ListaPeticiones() {
  const navigate = useNavigate();
  const handleVolver = () => {
    navigate('/MenuRRHH');
  }
  const [errorMessage, setErrorMessage] = useState('');
  const [lista, setLista] = useState([]);
  let selectedRowId = null
  let state = 'pendiente';
  const handleDiasDisponibles=()=>{
    
  }

  useEffect(() => {
    handleLista();
  }, []);

  const handleLista = async () => {
    try {
      const { data } = await axios.get('http://localhost:3001/listaPeticiones');
      if (data.success) {
        console.log('Se cargaron los datos exitosamente');
        console.log(data.petitions)
        setLista(data.petitions);

      } else {
        setErrorMessage(data.message || 'Error en la creación del empleado');

      }
    } catch (error) {
      setErrorMessage('Error en la autenticación. Inténtalo de nuevo.');

    }
  }
  const handleRowClick = (row) => {
    selectedRowId = row.id_peticion;
  }
  const handlleUpdate = async () => {
    console.log(state + selectedRowId)
    if (!selectedRowId) {
      alert('Por favor, selecciona una petición.');
      return;
    }
    try {
      const { data } = await axios.post('http://localhost:3001/ModificarPeticion', {
        peticionId: selectedRowId,
        estado: state
      });
      if (data.success) {
        console.log('Se eliminaron los datos exitosamente');
        selectedRowId = null;
        state = 'pendiente';
        handleLista()
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
            <th>Dias pedidos</th>
            <th>Dias Restantes</th>
          </tr>
        </thead>
        <tbody >
          {lista.map((row) => (
            <TableRow key={row.id_peticion} onClick={() => handleRowClick(row)} style={{ cursor: 'pointer', textAlign: 'center' }} className='file-peticiones'>
              <TableCell>{row.nombre_empleado}</TableCell>
              <TableCell>{row.apellido_empleado}</TableCell>
              <TableCell>{row.estado}</TableCell>
              <TableCell>{new Date(row.fecha_Inicio).toLocaleDateString()}</TableCell>
              <TableCell>{new Date(row.fecha_fin).toLocaleDateString()}</TableCell>
              <TableCell>{row.cant_dias}</TableCell>
              <TableCell>{row.cant_dias_vacaciones}</TableCell>
            </TableRow>))}
        </tbody>
      </table>
      <div style={{ margin: '1rem', padding: '2rem' }}>
        <button style={{ margin: '0 2rem' }} onClick={handleVolver}>Volver</button>
        <button style={{ margin: '0 2rem' }} onClick={(e) => { e.stopPropagation(); state = 'Aceptada'; handlleUpdate(state) }} >Aceptar Peticion</button>
        <button onClick={(e) => { e.stopPropagation(); state = 'Rechazada'; handlleUpdate() }}>Negar Peticion</button>
      </div>
    </div>
  )
}
//1. Traer todos los pedidos (consulta - select)
//2. Al presionar aceptar se debería cambiar el estado a aceptado (update)
//3. Al presionar rechazar se deberia cambiar el estado a rechazado (update)
export default ListaPeticiones