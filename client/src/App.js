import './App.css';
import PlayScreen from './pages/playscreen';
import Home from './pages/Home'
import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom"

function App() {
  return (
    <div className="App">
      <PlayScreen />
    </div>
  );
}

export default App;
