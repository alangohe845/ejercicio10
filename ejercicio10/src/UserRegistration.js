import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserRegistration.css'; 

const UserRegistration = () => {
  const [correo, setCorreo] = useState('');
  const [correosRegistrados, setCorreosRegistrados] = useState([]);
  const [correoValido, setCorreoValido] = useState(true);
  const [correoEditado, setCorreoEditado] = useState('');
  const [editandoCorreo, setEditandoCorreo] = useState(null);
  const [correoEditadoValido, setCorreoEditadoValido] = useState(true);

  useEffect(() => {
    fetchCorreosRegistrados();
  }, []);

  const fetchCorreosRegistrados = async () => {
    try {
      const response = await axios.get('http://localhost:3001/correos');
      console.log('Respuesta del servidor:', response.data);
      setCorreosRegistrados(response.data);
    } catch (error) {
      console.error('Error al obtener los correos registrados:', error);
    }
  };
  
  const handleCorreoChange = (e) => {
    const value = e.target.value;
    setCorreo(value);
    const correoValidoPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setCorreoValido(correoValidoPattern.test(value));
  };

  const handleCorreoEditadoChange = (e) => {
    const value = e.target.value;
    setCorreoEditado(value);
    const correoValidoPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setCorreoEditadoValido(correoValidoPattern.test(value));
  };

  const handleAgregarCorreo = async () => {
    try {
      await axios.post('http://localhost:3001/correos', { correo });
      setCorreo('');
      fetchCorreosRegistrados();
    } catch (error) {
      console.error('Error al agregar el correo:', error);
    }
  };

  const handleEliminarCorreo = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/correos/${id}`); 
      fetchCorreosRegistrados();
    } catch (error) {
      console.error('Error al eliminar el correo:', error);
    }
  };

  const handleEditarCorreo = async (id) => {
    try {
      await axios.put(`http://localhost:3001/correos/${id}`, { correo: correoEditado });
      setCorreoEditado('');
      fetchCorreosRegistrados();
      setEditandoCorreo(null);
    } catch (error) {
      console.error('Error al editar el correo:', error);
    }
  };

  return (
    <div className="user-registration-container">
      <h1>Registro de Usuarios</h1>
      <div className="input-group">
        <input 
          type="email" 
          value={correo} 
          onChange={handleCorreoChange} 
          placeholder="Ingrese un correo electrónico" 
          className={!correoValido ? 'input-invalido' : ''}
        />
        <button 
          onClick={handleAgregarCorreo} 
          disabled={!correoValido}
        >
          Agregar Correo
        </button>
      </div>
      {!correoValido && <p className="mensaje-error">Por favor ingrese un correo electrónico válido.</p>}
      <h2>Correos Registrados</h2>
      <table className="email-table">
        <thead>
          <tr>
            <th>Correo Electrónico</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {correosRegistrados.map((correo) => (
            <tr key={correo.id}>
              <td>
                {editandoCorreo === correo.id ? (
                  <input 
                    type="text" 
                    value={correoEditado} 
                    onChange={handleCorreoEditadoChange} 
                    className={!correoEditadoValido ? 'input-invalido' : ''}
                  />
                ) : (
                  correo.correo
                )}
              </td>
              <td>
                {editandoCorreo === correo.id ? (
                  <button 
                    className="edit-note-button" 
                    onClick={() => handleEditarCorreo(correo.id)} 
                    disabled={!correoEditadoValido}
                  >
                    Guardar
                  </button>
                ) : (
                  <button 
                    className="edit-note-button" 
                    onClick={() => setEditandoCorreo(correo.id)}
                  >
                    Editar
                  </button>
                )}
                <button className="delete-note-button" onClick={() => handleEliminarCorreo(correo.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserRegistration;
