import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './components/Home';
import FilmList from './components/FilmList';
import FilmDetail from './components/FilmDetail';
import './App.css';

function App() {
  return (
    <Router>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/films" element={<FilmList />} />
          <Route path="/films/:id" element={<FilmDetail />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;