import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Heading, Input, Textarea, Button, Stack, Flex, Text } from '@chakra-ui/react';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';

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
    <Box maxW="600px" m="auto" p="20px">
      <Heading textAlign="center" mb="20px">{modoEdicion ? 'Editar Nota' : 'Subir nueva nota'}</Heading>
      <form onSubmit={modoEdicion ? handleGuardarNota : handleAgregarNota}>
        <Stack spacing="15px">
          <Input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Título"
            isRequired
          />
          <Textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Descripción"
            isRequired
          />
          <Flex justifyContent="space-between">
            <Button type="submit" colorScheme="blue">
              {modoEdicion ? 'Actualizar Nota' : 'Agregar Nota'}
            </Button>
            {modoEdicion && (
              <Button variant="outline" onClick={handleCancelarEdicion}>Cancelar</Button>
            )}
          </Flex>
        </Stack>
      </form>
      
      <Heading as="h2" size="md" mb="20px">Notas:</Heading>
      <Stack spacing="20px">
        {notas.map((nota) => (
          <Box key={nota.id} p="15px" borderWidth="1px" borderRadius="md">
            <Heading as="h3" size="md">{nota.titulo}</Heading>
            <Text>{nota.descripcion}</Text>
            <Flex mt="10px">
              <Button onClick={() => handleEditarNota(nota)} leftIcon={<EditIcon />} mr="5px">Editar</Button>
              <Button onClick={() => handleEliminarNota(nota.id)} leftIcon={<DeleteIcon />} colorScheme="red">Eliminar</Button>
            </Flex>
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

export default NoteApp;
