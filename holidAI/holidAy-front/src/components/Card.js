import React from 'react';
import logo from "../assets/logo.png"

const Card = () => {
  return (
    <div className="w-1/3 rounded-lg">
        <img className=" w-10 " src={logo}></img>
        <h3 className='font-montserrat text-2xl font-semibold leading-7 text-left'>Day #2 - Mon, Dec 17th</h3>
        <p className='font-montserrat text-2xl font-semibold leading-7 text-left'>Nocturnal visit</p>
        <span className='font-montserrat text-2xl font-semibold leading-7 text-left'>Louvre</span>
    </div>
  );
};

export default Card;
