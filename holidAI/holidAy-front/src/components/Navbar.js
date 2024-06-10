import React from 'react';
import logo from "../assets/logo.png"

const Navbar = () => {
  return (
    <div className="flex items-center justify-between px-12 py-10 gap-2  bg-black w-[1440px] h-[69px]">
      <div className="flex items-center gap-4">
        <img className=" w-10 " src={logo}></img>
        <span className='font-montserrat text-2xl font-semibold leading-7 text-left'>
        <span className='text-white ' >Travel</span><span className=' text-primary-purple'>Ai</span>
      </span>
      </div>
    </div>
  );
};

export default Navbar;
