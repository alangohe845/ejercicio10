import React from 'react';
import { Center, Flex, Card, CardHeader, CardBody, CardFooter, Button, Stack, Heading, Text, Divider, ButtonGroup, Image } from '@chakra-ui/react';

export const Home = () => {
  return (
    <Center h="100vh">
      <Flex direction="column" align="center" justify="center">
        <Card maxW='sm'>
          <CardBody>
            <Image
              src='https://www.telegraph.co.uk/content/dam/technology/2015/12/11/gmail-envelope_trans_NvBQzQNjv4BqqVzuuqpFlyLIwiB6NTmJwfSVWeZ_vEN7c6bHu2jJnT8.jpg?imwidth=680'
              alt='Green double couch with wooden legs'
              borderRadius='lg'
            />
            <Stack mt='6' spacing='3'>
              <Heading size='md'>Panel principal</Heading>
              <Text>
              Empieza tu día organizando tus tareas y manteniendo a tus contactos informados.
              </Text>
            </Stack>
          </CardBody>
        </Card>
      </Flex>
    </Center>
  );
};
