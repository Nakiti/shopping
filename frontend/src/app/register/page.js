"use client";
import Link from 'next/link';

import axios from 'axios';
import { useState } from "react";

export default function Register() {
   const [inputs, setInputs] = useState({username: "", email: "", password: ""});
   const [error, setError] = useState(null)

   const handleChange = (e) => {
      setInputs(prev => ({...prev, [e.target.name]: e.target.value}))
   }

   const handleSubmit = async (e) => {
      e.preventDefault()
      if (inputs.username.length > 0 && inputs.email.length > 0 && inputs.password.length > 0) {
         try {
            const result = await axios.post("http://localhost:4000/user/register", inputs)

            if (result.status == 409) {
               setError("User already exists")
            } else {
               window.location.href = "/login"; 
            }

         } catch (e) {
            if (e.response.status == 409) {
               setError(e.response.data)
            } 

            setError(e.response.data)
         }
      }
   }

   return (
      <main className="flex items-center justify-center min-h-[calc(100vh-4.05rem)] font-serif bg-gray-50">
         <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full" >
            <h1 className="text-2xl font-bold text-gray-900 mb-8 text-center">Register</h1>
            <form>
               <div className="mb-4">
                  <label className="block text-gray-700 mb-2" htmlFor="name">
                     Name
                  </label>
                  <input
                     // type="name"
                     id="name"
                     className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                     placeholder="Enter your name"
                     name="username"
                     onChange={handleChange}
                     required
                  />
               </div>
               <div className="mb-4">
                  <label className="block text-gray-700 mb-2" htmlFor="email">
                     Email
                  </label>
                  <input
                     type="email"
                     id="email"
                     className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                     placeholder="Enter your email"
                     name="email"
                     onChange={handleChange}

                     required
                  />
               </div>
               <div className="mb-6">
                  <label className="block text-gray-700 mb-2" htmlFor="password">
                     Password
                  </label>
                  <input
                     type="password"
                     id="password"
                     className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                     placeholder="Enter your password"
                     name="password"
                     onChange={handleChange}
                     required
                  />
               </div>
               {error && (
                     <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                        <strong className="font-bold">Error: </strong>
                        <span className="block sm:inline">{error}</span>
                     </div>
               )}
               <div className="flex justify-center">
                     <button
                     type="submit"
                     className="w-1/2 justify-self-center bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200"
                     onClick={handleSubmit}
                     >
                        Register
                     </button>
               </div>
               <div className="flex flex-row justify-center items-center space-x-2 mt-5 text-sm">
                     <p>Have an account?</p>
                     <Link href="/login" className="text-blue-600 hover:underline">Login</Link>
               </div>
            </form>
         </div>
      </main>
   )
}
