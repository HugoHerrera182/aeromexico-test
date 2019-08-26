import React from 'react';
import './App.css';
import HeaderComponent from './components/Header'
import FlightSearchComponent from './components/FlightSearch'

function App() {
  return (
    <div >
      <header>
        <HeaderComponent></HeaderComponent>
      </header>
      <section>
        <FlightSearchComponent></FlightSearchComponent>
      </section>
    </div>
  );
}

export default App;
