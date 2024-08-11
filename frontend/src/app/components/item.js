"use client"

import React from 'react';
import { AuthContext } from '../context/authContext';
import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import Sidebar from './sidebar';

const Item = ({ item }) => {
   const [isSidebarOpen, setIsSidebarOpen] = useState(false)
   const [items, setItems] = useState([])
   const {currentUser} = useContext(AuthContext)

   const handleClose = () => {
      setIsSidebarOpen(false)
   }

   const handleClick = () => {
      console.log(item.link)
      window.open(item.link, "_blank", "noopener,noreferrer")
   }

   const handleCartAdd = async () => {
      const newItem = {
         id: item.id,
         image: item.image, 
         name: item.name,
         price: item.price,
         brand: item.brand,
         link: item.link
      }

      setIsSidebarOpen(false)

      if (currentUser == null) {
         const items = JSON.parse(sessionStorage.getItem("items")) || []

         if (!items.some(temp => temp.id == item.id)) {
            sessionStorage.setItem("items", JSON.stringify([...items, newItem]))
            setItems([newItem, ...items, ])
         }
         
      } else {
         try {
            const cart = await axios.get(`http://localhost:4000/cart/get/${currentUser.user_id}`)
            console.log("cart", cart)

            if (cart.data.length > 0) {
               const items = await axios.get(`http://localhost:4000/cartItem/get/${cart.data[0].cart_id}`)

               const response = await axios.post(`http://localhost:4000/cartItem/add`, {
                  cart_id: cart.data[0].cart_id,
                  product_id: item.id,
                  image: item.image, 
                  name: item.name,
                  price: item.price,
                  brand: item.brand,
                  link: item.link
               })

               setItems([newItem, ...items.data])

               // console.log(items.data)

            } else {
               try {
                  await axios.post(`http://localhost:4000/cart/create`, {user_id: currentUser.user_id})
                  const newCart = await axios.get(`http://localhost:4000/cart/get/${currentUser.user_id}`)
                  console.log("new cart", newCart)
                  await axios.post(`http://localhost:4000/cartItem/add`, {
                        cart_id: newCart.data[0].cart_id,
                        product_id: item.id,
                        image: item.image, 
                        name: item.name,
                        price: item.price,
                        brand: item.brand,
                        link: item.link
                  })

                  setItems([newItem])
               } catch (e) {
                  console.log(e)
               }
            }
         } catch (e) {
               console.log(e)
         }
      }

      setIsSidebarOpen(true)
      setTimeout(() => {
         setIsSidebarOpen(false)
      }, 3000)
   }

   return (
      <div className="relative overflow-hidden">
         <Sidebar onClose={handleClose} isOpen={isSidebarOpen} items={items} />
         <div key={item.id} className="bg-white shadow-sm transition-transform transform hover:scale-105 hover:shadow-lg cursor-pointer relative group">
               <div className="relative">
                  <img src={item.image} alt={item.name} className="w-full h-72 object-cover" onClick={handleClick} />
               </div>
               <div className="px-4 pb-4">
                  <h2 className="text-l font-bold text-gray-900 mt-4 cursor-pointer" onClick={handleClick}>{item.name}</h2>
                  <p className="text-gray-700 text-xs mt-2 cursor-pointer" onClick={handleClick}>{item.brand}</p>
                  <div className="flex flew-row justify-between items-center">
                     <p className="text-gray-900 text-xs font-bold mt-4 cursor-pointer" onClick={handleClick}>{item.price}</p>
                     <div className="relative">
                           <button className="text-gray-900 text-xs font-bold mt-4" onClick={handleCartAdd}>
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                 <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                              </svg>
                           </button>
                     </div>
                  </div>
               </div>
               <span className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-max opacity-0 group-hover:opacity-100 transition-opacity bg-gray-700 text-white text-xs rounded py-1 px-2">
                  Open Site
               </span>
         </div>
      </div>
   );
};

export default Item;
