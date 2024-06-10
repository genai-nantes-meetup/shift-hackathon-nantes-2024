import React from "react";
import { useState } from "react";
import { HiChevronRight } from "react-icons/hi";
import { HiChevronDown } from "react-icons/hi";

const Collapsible = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button
        className="font-bold text-lg mb-2 inline-flex justify-between w-full items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        {title}
        {isOpen ? <HiChevronDown /> : <HiChevronRight />}
      </button>
      {isOpen && <div>{children}</div>}
    </div>
  );
};

export default Collapsible;
