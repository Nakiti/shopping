"use client";

import { useState, useEffect, useContext } from 'react';
import CartItem from '../components/cartItem';
import { AuthContext } from '../context/authContext';
import axios from 'axios';


export default function Cart() {
   const [cartItems, setCartItems] = useState(null);
   const {currentUser} = useContext(AuthContext)
   let brand = ""
  
   const getTotalAmount = () => {
      let sum = 0;

      cartItems.forEach((item) => {
         sum += parseFloat(item.price.slice(1))
      })

      return sum.toFixed(2)
   };

   const handleDelete = async (id) => {
      if (currentUser != null) {
         try {
               await axios.post(`http://localhost:4000/cartItem/remove/${id}`)
               setCartItems(prevItems => prevItems.filter(item => item.cartitem_id !== id));
         } catch (e) {
               console.log(e)
         }
      } else {
         setCartItems(prevItems => {
               const updatedItems = prevItems.filter(item => item.cartitem_id !== id);
               sessionStorage.setItem("items", JSON.stringify(updatedItems));
               return updatedItems;
         });
      }
   }

   useEffect(() => {
      const fetchData = async() => {
         if (currentUser != null) {
            try {
               const response = await axios.get(`http://localhost:4000/cart/get/${currentUser.user_id}`)
               const items = await axios.get(`http://localhost:4000/cartItem/get/${response.data[0].cart_id}`)
               items.data.sort((a, b) => {
                  const aUpper = a.brand.toUpperCase
                  const bUpper = b.brand.toUpperCase

                  if (aUpper < bUpper) {
                     return -1
                  }
                  if (aUpper > bUpper) {
                     return 1
                  }

                  return 0
               })
               setCartItems(items.data)
            } catch (e) {
               console.log(e)
            }

         } else {
            const data = JSON.parse(sessionStorage.getItem("items")) || []
            data.sort((a, b) => {
               const aUpper = a?.brand?.toUpperCase() || ""
               const bUpper = b?.brand?.toUpperCase() || ""

               if (aUpper < bUpper) {
                  return -1
               }

               if (aUpper > bUpper) {
                  return 1
               }

               return 0
            })
            console.log(data)
            setCartItems(data || [])
         }
      }

      fetchData()
   }, [])
  
   return (
      <div className='font-serif bg-white'>
         <h1 className="text-3xl font-bold text-color3 bg-white mb-8 mt-4 text-center">Your Cart</h1>
         <main className="flex flex-col items-center justify-start min-h-screen bg-white py-2">
            <div className="flex w-full max-w-5xl px-4">
               <div className="w-full max-w-3xl mt-10">
                  <div className='flex flex-col'>
                     <div className='flex flex-row mb-4'>
                        <h2 className='mr-4'>Brands:</h2>
                        {cartItems && cartItems.map((item, index) => {
                           let show = false;

                           if (item.brand !== brand) {
                              show = true;
                              brand = item.brand;
                           }
                           return (
                              <div key={index}>
                                 {show && (
                                    <a href={`#${item.brand}`} className="bg-color6 text-white py-2 px-4 rounded-md mr-2">
                                       {item.brand}
                                    </a>
                                 )}
                              </div>
                           );
                        })}
                     </div>

                     {cartItems && cartItems.map((item, index) => {
                        let show = false;

                        if (item.brand !== brand) {
                           show = true;
                           brand = item.brand;
                        }

                        return (
                           <div key={index}>
                              {show && (
                                 <h1 id={item.brand} className="text-2xl font-bold text-gray-800 my-3">
                                    {item.brand}
                                 </h1>
                              )}
                              <CartItem item={item} handleDelete={handleDelete} />
                           </div>
                        );
                     })}
                  </div>
               </div>
               {cartItems && (
                  <div className="w-full max-w-xs ml-10 p-4">
                     <div className="border-t border-gray-200 py-4 mt-4 text-right">
                           <h2 className="text-xl font-bold text-gray-900">Total</h2>
                           <p className="text-xl font-bold text-gray-900">${getTotalAmount()}</p>
                     </div>
                  </div>
               )}
            </div>
         </main>
      </div>
   );
}