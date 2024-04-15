import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'; 
import NoteApp from './NoteApp';
import UserRegistration from './UserRegistration';
import './App.css'; 

const App = () => {
  return (
    <Router>
      <div className="container">
        <h1 className="heading">Panel de Navegación</h1>
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
  );
};

const Home = () => (
    <div className="panel-principal">
      <h2>PANEL PRINCIPAL</h2>
      <p>Agrega notas y notifica a tus contactos vía EMAIL</p>
    </div>

);

export default App;
