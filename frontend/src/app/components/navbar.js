"use client"

import Link from 'next/link';
import { FaUser, FaSearch, FaShoppingBag } from 'react-icons/fa';
import { useContext, useState, useRef, useEffect } from 'react';
import { filterContext } from '../shop/page';
import Sidebar from './sidebar';
import { AuthContext } from '../context/authContext';

const Navbar = () => {
   const [dropdown, setDropdown] = useState(false);

   const { currentUser, logout } = useContext(AuthContext);
   const dropdownRef = useRef(null);

   const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
         setDropdown(false);
      }
   };

   useEffect(() => {
      if (dropdown) {
         document.addEventListener('mousedown', handleClickOutside);
      } else {
         document.removeEventListener('mousedown', handleClickOutside);
      }

      return () => {
         document.removeEventListener('mousedown', handleClickOutside);
      };
   }, [dropdown]);

   return (
      <nav className="bg-white border-b border-gray-200 font-serif">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
               <div className="flex justify-between h-16">
                  <div className="flex-shrink-0 flex items-center">
                     <Link href={"/"}>
                           <h1 className="text-xl font-bold text-color3">Shopping Site</h1>
                     </Link>
                  </div>
                  <div className="flex space-x-4 items-center">
                     <div 
                           className='relative group' 
                           onClick={() => setDropdown(!dropdown)}
                           ref={dropdownRef}
                     >
                           <FaUser className="w-5 h-5 cursor-pointer" />
                           {dropdown && (
                              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 shadow-lg">
                                 {currentUser ? (
                                       <button 
                                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                          onClick={logout}
                                       >
                                          Logout
                                       </button>
                                 ) : (
                                       <button 
                                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                          onClick={() => window.location.href = "/login"}
                                       >
                                          Login
                                       </button>
                                 )}
                              </div>
                           )}
                     </div>
                     <Link href={"/shop"}>
                           <FaSearch className="w-5 h-5" />
                     </Link>
                     <div className='relative group'>
                           <Link href={"/cart"}>
                              <FaShoppingBag className="w-5 h-5" />
                           </Link>
                     </div>
                  </div>
               </div>
         </div>
      </nav>
   );
};

export default Navbar;
