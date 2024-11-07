import React, { useState, useEffect } from 'react';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
//import { DateRangePicker } from 'react-date-range';
import axios from 'axios'
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import '../../estilos/calendario.css'
function VacacionesPedidoForm() {
  const initialInputValues = {
    startDate: new Date(),
    endDate: new Date(),
    dias: '',
    otrosDias: '',
    finalDays: '',
    state: 'pendiente'
  };
  let prohibidoMandar = false;
  let user = JSON.parse(localStorage.getItem('user'));
  const [inputs, setInputs] = useState(initialInputValues);
  const [loading, setLoading] = useState(false);
  const [petitionId, setPetitionId] = useState(null);
  const [errorMessage, setErrorMessage] = useState();
  const [diasRestantes, setDiasRestantes] = useState(0);

  const [disabledRanges, setDisabledRanges] = useState([
  ]);
  const [selectedOption, setSelectedOption] = useState('');

  const handleSelectedOption = (event) => {
    setSelectedOption(event.target.value);
  };


  const fechasOtrosDepartamentos = async () => {
    try {
      const { data } = await axios.post('http://localhost:3001/ExistenPedidosDepartemento', { empleadoDepartamento: user.departamento });
      if (data.success) {
        console.log(data.fechas)

          const ranges = data.fechas.map(range => ({
            start: new Date(range.fecha_Inicio),
            end: new Date(range.fecha_fin)
        }));

        setDisabledRanges(prevRanges => [...prevRanges, ...ranges]);

        console.log(ranges)
      }
      else {
        console.log('Credenciales incorretas');
      }
    }
    catch (error) {
      console.error('Error en la autenticación:', error.message);
    }

  }
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
  const SePasaMax = () => {
    let mostrar = false;
    if (selectedOption != 'otro') {
      if (diasRestantes < parseInt(selectedOption)) {
        mostrar = true;
        prohibidoMandar = true;
      }
    }
    else if (diasRestantes < parseInt(inputs.otrosDias)) {
      mostrar = true
      prohibidoMandar = true;
    }
    return mostrar;
  }
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setInputs({ ...inputs, [name]: value });
  };

  // const handleDateChange = (ranges) => {
  //   setInputs({
  //     ...inputs,
  //     startDate: ranges.selection.startDate,
  //     endDate: ranges.selection.endDate
  //   });
  // };

  const handleStartDateChange = (date) => {
    setInputs((prevInputs) => ({ ...prevInputs, startDate: date }));
  };

  const handleEndDateChange = (date) => {
    setInputs((prevInputs) => ({ ...prevInputs, endDate: date }));
  };


  useEffect(() => {
    const calculateDays = (startDate, endDate) => {
      let firstDate = new Date(startDate);
      const secondDate = new Date(endDate);
      console.log(firstDate + secondDate)
      let diffDays = 0;
      while (firstDate <= secondDate) {
        if (firstDate.getDay() !== 0 && firstDate.getDay() !== 6) { // Excluye sábados y domingos
          diffDays++;
        }
        firstDate.setDate(firstDate.getDate() + 1);
      }
      return diffDays;
    };

    const totalDays = calculateDays(inputs.startDate, inputs.endDate);
    const finalDias = inputs.dias === 'otro' ? inputs.otrosDias : inputs.dias;

    setInputs({ ...inputs, finalDays: finalDias });
    if (totalDays != finalDias && inputs.finalDays != '') {
      prohibidoMandar = true;
      setErrorMessage("La cantidad de días seleccionados no coincide con la especificada.");

    }
    else {
      setErrorMessage("");
      prohibidoMandar = false;
    }
  }, [inputs.startDate, inputs.endDate, inputs.dias, inputs.otrosDias]);

  useEffect(() => {
    DiasRestantes()
    fechasOtrosDepartamentos()
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3001/createPetition', {
        startDate: inputs.startDate,
        endDate: inputs.endDate,
        days: inputs.finalDays,
        state: inputs.state,
      }); if (response.data.success) {
        console.log('Se cargaron los datos exitosamente');
        const id = response.data.id; setPetitionId(id);
        try {
          const resp = await axios.post('http://localhost:3001/createPetitionEmployee', {
            petitionId: id, userId: user.id_empleado
          });
          if (resp.data.success) {
            alert('Se cargaron los datos exitosamente');
            setInputs(initialInputValues); // Resetear los inputs 
          } else {
            console.log(resp.data.message || 'Error en la creación del pedido');

          }
        } catch (error) { console.log(error); }
      }
      else { console.log(response.data.message || 'Error en la creación del pedido'); }
    }
    catch (error) { console.log('Error en la autenticación. Inténtalo de nuevo.'); }
    finally { setLoading(false); }

  };
  const navigate = useNavigate();
  const handleVolver = () => {
    navigate('/MenuEmpleado');
  }
 const cantidadDias=['otro', '14', '21', '28', '35']
 
 
  const isWeekday = (date) => {
    const day = date.getDay();
    return day !== 0 && day !== 6;
  };


  return (
    <div className='calendario' style={{ backgroundColor: 'lightpink' }}>
      <div style={{ display: 'flex' }}>
        <div style={{ backgroundColor: 'white', margin: 'auto 1rem', width: '12rem', height: '3rem', textAlign: 'center', alignContent: 'center', borderRadius:'10px', color:'green'}}>Dias restantes: {diasRestantes} </div>
        <form onSubmit={handleSubmit} style={{ display: 'right' }}>
          <div>
            <div><label htmlFor='dias'>Cantidad de días: </label></div>
            <select name="dias" value={inputs.dias} onChange={handleInputChange} onClick={handleSelectedOption} required>
            <option  value="">Seleccione</option>
            {cantidadDias.map((dias, index) => (
              <option key={index} value={dias}>
                {  dias=='otro' && ( (dias))}
                {dias<=diasRestantes && (dias)}
             
              </option>
            ))}
             
            </select>

            {inputs.dias === 'otro' && (
              <div style={{ width: '15rem', margin: 'auto' }}>
                <input
                  type='text'
                  name='otrosDias'
                  value={inputs.otrosDias}
                  style={{ textAlign: 'center' }}
                  onChange={handleInputChange}

                />
              </div>
            )}
          </div>
              <div>
            <label className='laberl-calendar-inicio' htmlFor='calendar-inicio'>Fecha de inicio:</label>
            <DatePicker
            
              selected={inputs.startDate}
              onChange={handleStartDateChange}
              minDate={new Date()}
              dateFormat="dd-MM-yyyy"
              className='calendar-inicio'
             filterDate={isWeekday}
             
              excludeDateIntervals={disabledRanges}
            />
          </div>

          <div >
            <label className='laberl-calendar-fin' htmlFor='calendar-fin'>Fecha de fin:</label>
            <DatePicker
             
              className='calendar-fin'
              selected={inputs.endDate}
              onChange={handleEndDateChange}
              minDate={inputs.startDate}
              dateFormat="dd-MM-yyyy"
              excludeDateIntervals={disabledRanges}
             filterDate={isWeekday}
              
            
            />
          </div>
          {console.log(inputs.otrosDias)}
          {SePasaMax() && (
            <div>
              Su cantidad máxima es {diasRestantes}
            </div>
          )}
          {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
          <div style={{ margin: '1rem' }}>
            <button type="submit" value="Enviar" disabled={prohibidoMandar}>
              {loading ? 'Cargando...' : 'Enviar'}
            </button>
          </div>
        </form>
      </div>
      <div style={{ backgroundColor: 'white' }}>
        <button style={{ width: '5rem', margin: '2rem' }} onClick={handleVolver}>Volver</button>
      </div>
    </div>
  );
}
//no funciona el segundo alta
//1-cargar en peticiones
//2-obtener id de peticion
//3-cargar en peticiones_empleados
//4-bloquear si ya hicieron un pedido
export default VacacionesPedidoForm;
