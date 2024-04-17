import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Input, Table, Tbody, Td, Th, Thead, Tr, useToast, Flex, Center, Heading, Box, IconButton, Text } from '@chakra-ui/react';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';

const UserRegistration = () => {
  const [correo, setCorreo] = useState('');
  const [correosRegistrados, setCorreosRegistrados] = useState([]);
  const [correoValido, setCorreoValido] = useState(true);
  const [correoEditado, setCorreoEditado] = useState('');
  const [editandoCorreo, setEditandoCorreo] = useState(null);
  const [correoEditadoValido, setCorreoEditadoValido] = useState(true);
  const toast = useToast();

  useEffect(() => {
    fetchCorreosRegistrados();
  }, []);

  const fetchCorreosRegistrados = async () => {
    try {
      const response = await axios.get('http://localhost:3001/correos');
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
      toast({
        title: "Correo agregado",
        description: "El correo se ha agregado correctamente.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error al agregar el correo:', error);
      toast({
        title: "Error",
        description: "Ha ocurrido un error al agregar el correo.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleEliminarCorreo = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/correos/${id}`); 
      fetchCorreosRegistrados();
      toast({
        title: "Correo eliminado",
        description: "El correo se ha eliminado correctamente.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error al eliminar el correo:', error);
      toast({
        title: "Error",
        description: "Ha ocurrido un error al eliminar el correo.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleEditarCorreo = async (id) => {
    try {
      await axios.put(`http://localhost:3001/correos/${id}`, { correo: correoEditado });
      setCorreoEditado('');
      fetchCorreosRegistrados();
      setEditandoCorreo(null);
      toast({
        title: "Correo editado",
        description: "El correo se ha editado correctamente.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error al editar el correo:', error);
      toast({
        title: "Error",
        description: "Ha ocurrido un error al editar el correo.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box maxW="600px" m="auto" p="20px">
      <Heading textAlign="center" mb="20px">Registro de Usuarios</Heading>
      <Flex mb="20px">
        <Box flex="1">
          <Input 
            type="email" 
            value={correo} 
            onChange={handleCorreoChange} 
            placeholder="Ingrese un correo electrónico" 
            isInvalid={!correoValido}
          />
          {!correoValido && <Text color="red.500">Por favor ingrese un correo electrónico válido.</Text>}
        </Box>
        <Box ml="10px">
          <Button 
            onClick={handleAgregarCorreo} 
            disabled={!correoValido}
            colorScheme="blue"
          >
            Agregar Correo
          </Button>
        </Box>
      </Flex>
      <Table variant="simple" mb="20px">
        <Thead>
          <Tr>
            <Th>Correo Electrónico</Th>
            <Th>Acciones</Th>
          </Tr>
        </Thead>
        <Tbody>
          {correosRegistrados.map((correo) => (
            <Tr key={correo.id}>
              <Td>
                {editandoCorreo === correo.id ? (
                  <Input 
                    type="text" 
                    value={correoEditado} 
                    onChange={handleCorreoEditadoChange} 
                    isInvalid={!correoEditadoValido}
                  />
                ) : (
                  correo.correo
                )}
              </Td>
              <Td>
                {editandoCorreo === correo.id ? (
                  <Button 
                    onClick={() => handleEditarCorreo(correo.id)} 
                    disabled={!correoEditadoValido}
                    mr="5px"
                  >
                    Guardar
                  </Button>
                ) : (
                  <IconButton 
                    onClick={() => setEditandoCorreo(correo.id)}
                    aria-label="Editar"
                    icon={<EditIcon />}
                    mr="5px"
                  />
                )}
                <IconButton 
                  onClick={() => handleEliminarCorreo(correo.id)}
                  aria-label="Eliminar"
                  colorScheme="red"
                  icon={<DeleteIcon />}
                />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default UserRegistration;
