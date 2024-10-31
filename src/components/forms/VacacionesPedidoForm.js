import React, { useState, useEffect } from 'react';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRangePicker } from 'react-date-range';
import axios from 'axios'
import { useNavigate } from "react-router-dom";
function VacacionesPedidoForm() {
  const initialInputValues = {
    startDate: new Date(),
    endDate: new Date(),
    dias: '',
    otrosDias: '',
    finalDays: '',
    state: 'pendiente'
  };
  let prohibidoMandar=false;
  let user = JSON.parse(localStorage.getItem('user'));
  const [inputs, setInputs] = useState(initialInputValues);
  const [loading, setLoading] = useState(false);
  const [petitionId, setPetitionId] = useState(null);
  const [errorMessage, setErrorMessage] = useState();

  const [selectedOption, setSelectedOption] = useState('');

  const handleSelectedOption = (event) => {
    setSelectedOption(event.target.value);
    console.log(event.target.value);
  };
  const cantidadLimite = () => {
    let limiteDias = 0;
    if (user.antiguedad > 20) {
      limiteDias = 35;
    }
    else if (user.antiguedad > 10 && user.antiguedad <= 20) {
      limiteDias = 28;
    }
    else if (user.antiguedad > 5 && user.antiguedad <= 10) {
      limiteDias = 21;
    }
    else if (user.antiguedad > 1 && user.antiguedad <= 5) {
      limiteDias = 14;
    }
    return limiteDias;
  }

  const SePasaMax = () => {
    let mostrar = false;
    if (selectedOption != 'otro') {
      if (cantidadLimite() < parseInt(selectedOption)  ) {
        mostrar=true;
        prohibidoMandar=true;
      }
    }
    else if(cantidadLimite() < parseInt(inputs.otrosDias)){
      mostrar=true
      prohibidoMandar=true;
    }
    return mostrar;
  }
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setInputs({ ...inputs, [name]: value });
  };

  const handleDateChange = (ranges) => {
    setInputs({
      ...inputs,
      startDate: ranges.selection.startDate,
      endDate: ranges.selection.endDate
    });
  };

  useEffect(() => {
    const calculateDays = (startDate, endDate) => {
      let currentDate = new Date(startDate);
      const lastDate = new Date(endDate);
      let diffDays = 0;
      while (currentDate <= lastDate) {
        if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) { // Excluye sábados y domingos
          diffDays++;
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }
      return diffDays;
    };

    const totalDays = calculateDays(inputs.startDate, inputs.endDate);
    const finalDias = inputs.dias === 'otro' ? inputs.otrosDias : inputs.dias;

    setInputs({ ...inputs, finalDays: finalDias });

    if (totalDays != finalDias && inputs.finalDays != '') {
      prohibidoMandar=true;
      setErrorMessage("La cantidad de días seleccionados no coincide con la especificada.");
    
    }
    else { setErrorMessage(""); 
      prohibidoMandar=false;
    }
  }, [inputs.startDate, inputs.endDate, inputs.dias, inputs.otrosDias]);

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
  const handleVolver=()=>{
    navigate('/MenuEmpleado'); 
  }

  return (
    <div className='calendario' style={{ backgroundColor: 'lightpink' }}>
      <form onSubmit={handleSubmit}>
        <div>
          <div><label htmlFor='dias'>Cantidad de días: </label></div>
          <select name="dias" value={inputs.dias} onChange={handleInputChange} onClick={handleSelectedOption} required>
            <option name='dias' value='' ></option>
            <option name='dias' value='otro'>Otro</option>
            <option name='dias' value='14'>14</option>
            <option name='dias' value='21'>21</option>
            <option name='dias' value='28'>28</option>
            <option name='dias' value='35'>35</option>
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
        <DateRangePicker
          className='date-range'
          ranges={[{ startDate: inputs.startDate, endDate: inputs.endDate, key: 'selection' }]}
          onChange={handleDateChange}
          minDate={new Date()}
        />
        {console.log(inputs.otrosDias)}
        {SePasaMax() && (
          <div>
            Su cantidad máxima es {cantidadLimite()}
          </div>
        )}
        {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
        <div style={{margin:'1rem'}}>
          <button type="submit" value="Enviar" disabled={prohibidoMandar}>
            {loading ? 'Cargando...' : 'Enviar'}
          </button>
        </div>
      </form>
      <div style={{backgroundColor:'white'}}> 
          <button style={{width:'5rem',margin:'2rem'}} onClick={handleVolver}>Volver</button>
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
