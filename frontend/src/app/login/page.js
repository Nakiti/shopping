"use client";
import { useState, useContext, useEffect } from "react";
import Link from 'next/link';
import { AuthContext } from "../context/authContext";
import axios from "axios";
import { redirect } from "next/dist/server/api-utils";

export default function Login() {
   const [inputs, setInputs] = useState({email: "", password: ""})

   const {login, currentUser} = useContext(AuthContext)
   const [error, setError] = useState("")


   const handleChange = (e) => {
      setInputs(prev => ({...prev, [e.target.name]: e.target.value}))
   }

   const handleSubmit = async (e) => {
      e.preventDefault()
   
      try {
         await login(inputs)
         window.location.href = "/shop?page=1"

      } catch (err) {
         console.log(err.response.data)
         setError(err.response.data)
      }

   }

   useEffect(() => {
      axios.defaults.withCredentials = true

      if (currentUser != null) {
         window.location.href = "/shop?page=1"
      }
   }, [])

   return (
      <main className="flex items-center justify-center min-h-[calc(100vh-4.05rem)] font-serif bg-gray-50">
         <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full" >
            <h1 className="text-2xl font-bold text-gray-900 mb-8 text-center">Login</h1>
            <form>
               <div className="mb-4">
                  <label className="block text-gray-700 mb-2" htmlFor="email">
                     Email
                  </label>
                  <input
                     type="email" id="email" name="email"
                     className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                     placeholder="Enter your email" required
                     onChange={handleChange}
                  />
               </div>
               <div className="mb-6">
                  <label className="block text-gray-700 mb-2" htmlFor="password">
                     Password
                  </label>
                  <input
                     type="password" id="password"name="password"
                     className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                     placeholder="Enter your password" required
                     onChange={handleChange}
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
                  type="submit" className="w-1/2 justify-self-center bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200"
                  onClick={handleSubmit}
                  >
                     Login
                  </button>
               </div>
               <div className="flex flex-row justify-center items-center space-x-2 mt-5 text-sm">
                  <p>Don't have an account?</p>
                  <Link href="/register" className="text-blue-600 hover:underline">Register</Link>
               </div>
            </form>
         </div>
      </main>
   )
}
