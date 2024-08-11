"use client";

import React, { useState, useEffect, useRef, useContext } from 'react';
import { filterContext } from '../shop/page';

const Radio = ({ items, id }) => {
   const [isOpen, setIsOpen] = useState(false);
   const [selectedOption, setSelectedOption] = useState(null);
   const dropdownRef = useRef(null);
   const [filters, setFilters] = useContext(filterContext);

   const toggleDropdown = () => setIsOpen(!isOpen);

   const handleRadioChange = (optionId) => {
      setSelectedOption(optionId);
   };

   const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
      }
   };

   useEffect(() => {
      switch (id) {
      case 'gender':
         setFilters((prev) => ({ ...prev, gender: selectedOption ? [selectedOption] : [] }));
         break;
      case 'price':
         setFilters((prev) => ({ ...prev, price: selectedOption ? [selectedOption] : [] }));
         break;
      case 'clothing':
         setFilters((prev) => ({ ...prev, clothing: selectedOption ? [selectedOption] : [] }));
         break;
      default:
         break;
      }
   }, [selectedOption, setFilters, id]);

   useEffect(() => {
      if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      } else {
      document.removeEventListener('mousedown', handleClickOutside);
      }

      return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      };
   }, [isOpen]);

   return (
      <div className="relative inline-block text-left" ref={dropdownRef}>
      <div>
         <button
            type="button"
            className="inline-flex justify-center w-full border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
            id="options-menu"
            aria-expanded="true"
            aria-haspopup="true"
            onClick={toggleDropdown}
         >
            {id}
            <svg
            className="-mr-1 ml-2 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
            >
            <path
               fillRule="evenodd"
               d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
               clipRule="evenodd"
            />
            </svg>
         </button>
      </div>

      {isOpen && (
         <div
            className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
         >
            <div className="py-1" role="none">
            {items.map((option) => (
               <label key={option.id} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                  <input
                  type="radio"
                  name={id}
                  value={option.value}
                  checked={selectedOption === option.value}
                  onChange={() => handleRadioChange(option.value)}
                  className="mr-2"
                  />
                  {option.label}
               </label>
            ))}
            </div>
         </div>
      )}
      </div>
   );
};

export default Radio;
