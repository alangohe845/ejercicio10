import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './NoteApp.css'; // Importamos nuestro archivo de estilos CSS

const NoteApp = () => {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [notas, setNotas] = useState([]);
  const [modoEdicion, setModoEdicion] = useState(null);
  const [notaIdSeleccionada, setNotaIdSeleccionada] = useState(null);

  useEffect(() => {
    fetchNotas();
  }, []);

  const fetchNotas = async () => {
    try {
      const response = await axios.get('http://localhost:3001/notas');
      setNotas(response.data);
    } catch (error) {
      console.error('Error al obtener las notas:', error);
    }
  };

  const handleAgregarNota = async () => {
    try {
      await axios.post('http://localhost:3001/notas', { titulo, descripcion });
      setTitulo('');
      setDescripcion('');
      await axios.post('http://localhost:3001/enviar-correo');
      fetchNotas(); 
    } catch (error) {
      console.error('Error al agregar la nota:', error);
    }
  };

  const handleEliminarNota = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/notas/${id}`);
      fetchNotas();
    } catch (error) {
      console.error('Error al eliminar la nota:', error);
    }
  };

  const handleEditarNota = async (nota) => {
    setModoEdicion(true);
    setTitulo(nota.titulo);
    setDescripcion(nota.descripcion);
    setNotaIdSeleccionada(nota.id);
  };

  const handleCancelarEdicion = () => {
    setModoEdicion(false);
    setTitulo('');
    setDescripcion('');
    setNotaIdSeleccionada(null);
  };

  const handleGuardarNota = async () => {
    try {
      await axios.put(`http://localhost:3001/notas/${notaIdSeleccionada}`, {
        titulo,
        descripcion
      });
      fetchNotas();
      setModoEdicion(false);
      setTitulo('');
      setDescripcion('');
      setNotaIdSeleccionada(null);
    } catch (error) {
      console.error('Error al guardar la nota:', error);
    }
  };

  return (
    <div className="noteapp-container">
      <h1>{modoEdicion ? 'Editar Nota' : 'Subir nueva nota'}</h1>
      <form onSubmit={modoEdicion ? handleGuardarNota : handleAgregarNota}>
        <label htmlFor="titulo">Título:</label>
        <input
          type="text"
          id="titulo"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          required
        />
        <br />
        <label htmlFor="descripcion">Descripción:</label>
        <textarea
          id="descripcion"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          required
        />
        <br />
        <button type="submit" className="add-note-button">
          {modoEdicion ? 'Actualizar Nota' : 'Agregar Nota'}
        </button>
        {modoEdicion && (
          <button type="button" onClick={handleCancelarEdicion}>Cancelar</button>
        )}
      </form>
      
      <h2>Notas:</h2>
      <div className="notes-container">
        {notas.map((nota) => (
          <div key={nota.id} className="note-item">
            <h3>{nota.titulo}</h3>
            <p>{nota.descripcion}</p>
            <div>
              <button className="edit-note-button" onClick={() => handleEditarNota(nota)}>Editar</button>
              <button className="delete-note-button" onClick={() => handleEliminarNota(nota.id)}>Eliminar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NoteApp;
