import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'; 
import NoteApp from './NoteApp';
import UserRegistration from './UserRegistration';
import { Home } from './Home'; // Importa el componente Home desde su archivo correspondiente
import { ChakraProvider } from '@chakra-ui/react';
import './App.css'; 

const App = () => {
  return (
    <ChakraProvider>
      <Router>
        <div>
          <nav className="navbar">
            <ul className="nav-list">
              <li className="nav-item">
                <Link to="/" className="nav-link">Inicio</Link>
              </li>
              <li className="nav-item">
                <Link to="/notas" className="nav-link">Subir Notas</Link>
              </li>
              <li className="nav-item">
                <Link to="/usuarios" className="nav-link">Registrar Usuarios</Link>
              </li>
            </ul>
          </nav>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/notas" element={<NoteApp />} />
            <Route path="/usuarios" element={<UserRegistration />} />
          </Routes>
        </div>
      </Router>
    </ChakraProvider>
  );
};

export default App;
