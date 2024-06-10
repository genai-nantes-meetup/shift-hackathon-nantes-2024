import React from 'react';
import Form from './components/Form';
import Map from './components/Map';
import './App.css';  // Assurez-vous que le chemin est correct selon la structure de vos dossiers
import Navbar from './components/Navbar';

function App() {
  return (     
      <div className='h-screen flex flex-col'>

        <Navbar/>   

        <div className="flex-grow w-screen pb-10 px-10 bg-primary-bg bg-cover bg-no-repeat flex justify-center overflow-hidden lg:flex-row flex-col md:flex-wrap">
          <Form />
          <Map></Map>
        </div>
      </div>
    );
}

export default App;
