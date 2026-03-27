import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './components/Home';
import ProjectDetail from './components/ProjectDetail';
import ProjectForm from './components/ProjectForm';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Link to="/" className="App-logo">Civil Engineer Portfolio</Link>
          <nav>
            <Link to="/">Projects</Link>
            <Link to="/add">Add Project</Link>
          </nav>
        </header>
        <main className="App-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects/:id" element={<ProjectDetail />} />
            <Route path="/add" element={<ProjectForm />} />
            <Route path="/edit/:id" element={<ProjectForm />} />
          </Routes>
        </main>
        <footer className="App-footer">
          <p>&copy; 2024 Civil Engineer Portfolio. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;