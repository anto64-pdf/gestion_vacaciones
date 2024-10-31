const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'gestionvacaciones',
});

db.connect(err => {
  if (err) {
    throw err;
  }
  console.log('Conectado a la base de datos MySQL.');
});

//empleados
app.post('/loginEmpleado', (req, res) => {
  const user = req.body.user
  const password = req.body.password
  //const { user, password } = req.body;
  console.log("credenciales:" + user + password)
  db.query('SELECT * FROM empleados WHERE usuario = ? AND clave = ?', [user, password], (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Error en la consulta' });
    }

    if (results.length > 0) {

      return res.json({ success: true, user: results[0] });
    } else {
      return res.json({ success: false, message: 'Credenciales incorrectas' });
    }
  });
});
app.post('/createEmployee', (req, res) => {
  const { name, lastname, antiguedad, user, password } = req.body;
  console.log(name + lastname + antiguedad + user + password)
  db.query('INSERT INTO `empleados`(`nombre_empleado`, `apellido_empleado`, `antiguedad`, `usuario`, `clave`) VALUES (?, ?, ?, ?, ?)',
    [name, lastname, antiguedad, user, password], (err, results) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Error en la consulta' });
      }
      if (results.affectedRows > 0) {
        return res.json({ success: true, message: 'Empleado creado exitosamente' });
      }
      else { return res.status(400).json({ success: false, message: 'No se pudo crear el empleado' }); }
    }
  );
});
app.post('/createPetition', (req, res) => {
  const { startDate, endDate, days, state } = req.body;
  console.log(startDate, endDate, days, state)
  db.query('INSERT INTO `peticiones`(`cant_dias`, `fecha_Inicio`, `fecha_fin`, `estado`) VALUES (?,?,?,?)',
    [days, startDate, endDate, state], (err, results) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Error en la peticion' });
      }
      const newPetitionId = results.insertId;
      console.log(newPetitionId)
      if (results.affectedRows > 0) {
        return res.json({ success: true, message: 'Peticion creada exitosamente', id: newPetitionId });
      }
      else { return res.status(400).json({ success: false, message: 'No se pudo crear la peticion' }); }
    }

  );
});
app.post('/createPetitionEmployee', (req, res) => {
  const { petitionId, userId } = req.body;
  console.log(petitionId, userId)
  db.query('INSERT INTO `empleados_peticiones`( `id_empleado`, `id_peticion`) VALUES (?,?)',
    [userId, petitionId], (err, results) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Error en la peticion' });
      }
      if (results.affectedRows > 0) {
        return res.json({ success: true, message: 'Peticion creada exitosamente' });
      }
      else { return res.status(400).json({ success: false, message: 'No se pudo crear la peticion' }); }
    }

  );
});

// peticiones
app.get('/listaPeticiones', (req, res) => {
  const body = req.body
  db.query('SELECT empleados.nombre_empleado, empleados.apellido_empleado, peticiones.cant_dias, ' +
    'peticiones.id_peticion, peticiones.estado, peticiones.fecha_Inicio, peticiones.fecha_fin from empleados ' +
    'INNER JOIN empleados_peticiones ON empleados.id_empleado=empleados_peticiones.id_empleado ' +
    'INNER JOIN peticiones ON empleados_peticiones.id_peticion=peticiones.id_peticion', (err, results) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Error en la consulta' });
      }

      if (results.length > 0) {
        console.log(results)
        return res.json({ success: true, petitions: results });
      } else {
        return res.json({ success: false, message: 'Credenciales incorrectas' });
      }
    });
});


app.post('/ModificarPeticion', (req, res) => {
  const {peticionId, estado } = req.body
  console.log('body:'+peticionId + estado)
  db.query('UPDATE peticiones SET estado=? WHERE `id_peticion`=?',
    [estado, peticionId], (err, results) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Error en la consulta' });
      }
     
      if (results.affectedRows > 0) {
        console.log('Resultados de la actualización:', results);
        return res.json({ success: true, message:'Update hecho correctamente'});
      } else {
        return res.json({ success: false, message: 'Credenciales incorrectas' });
      }
    });
});

app.post('/EstadoPeticion', (req, res) => {
  const {empleadoId } = req.body
  console.log(empleadoId)
  db.query('SELECT empleados.nombre_empleado, empleados.apellido_empleado, peticiones.cant_dias, ' +
    'peticiones.id_peticion, peticiones.estado, peticiones.fecha_Inicio, peticiones.fecha_fin from empleados ' +
    'INNER JOIN empleados_peticiones ON empleados.id_empleado=empleados_peticiones.id_empleado ' +
    'INNER JOIN peticiones ON empleados_peticiones.id_peticion=peticiones.id_peticion WHERE empleados.id_empleado=?',
    [empleadoId], (err, results) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Error en la consulta' });
      }
     
      if (results.length > 0) {
        console.log('Resultados de la actualización:', results);
        return res.json({ success: true, peticiones:results});
      } else {
        return res.json({ success: false, message: 'Credenciales incorrectas' });
      }
    });
});

//empleados
app.get('/listaEmpleados', (req, res) => {
  const body = req.body
  db.query('SELECT * FROM `empleados`', (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Error en la consulta' });
    }

    if (results.length > 0) {

      return res.json({ success: true, empleados: results });
    } else {
      return res.json({ success: false, message: 'Credenciales incorrectas' });
    }
  });
});

app.post('/ModificarEmpleado', (req, res) => {
  const { empleadoId, name, antiguedad, lastName, user, password } = req.body
  console.log(empleadoId)
  db.query('UPDATE empleados SET nombre_empleado=?, apellido_empleado=?, antiguedad=?,usuario=?, clave=?' +
    ' WHERE id_empleado=?',
    [name, lastName,antiguedad, user, password, empleadoId], (err, results) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Error en la consulta' });
      }

      if (results.affectedRows > 0) {

        return res.json({ success: true, message:'Actualizado correctamente'});
      } else {
        return res.json({ success: false, message: 'Credenciales incorrectas' });
      }
    });
});

app.post('/EliminarEmpleado', (req, res) => {
  const { EmpleadoId } = req.body
  console.log(EmpleadoId)
  db.query('DELETE FROM empleados WHERE id_empleado=?', [EmpleadoId], (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Error en la consulta' });
    }

    if (results.affectedRows > 0) {

      return res.json({ success: true, message: 'Se eliminaron correctamente' });
    } else {
      return res.json({ success: false, message: 'Credenciales incorrectas' });
    }
  });
});

app.post('/loginAdministrador', (req, res) => {
  const user = req.body.user
  const password = req.body.password
  //const { user, password } = req.body;
  console.log("credenciales:" + user + password)
  db.query('SELECT * FROM administradores WHERE usuario = ? AND clave = ?', [user, password], (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Error en la consulta' });
    }

    if (results.length > 0) {

      return res.json({ success: true, user: results[0] });
    } else {
      return res.json({ success: false, message: 'Credenciales incorrectas' });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
