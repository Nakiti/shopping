"use client";

import Head from 'next/head';
import Item from '../components/item';
import SearchBar from '../components/searchbar';
import Filters from '../components/filters';
import { useState, useContext, createContext, useRef, useEffect } from 'react';
import axios from "axios"
import { useRouter, useSearchParams, usePathname } from 'next/navigation';


export const filterContext = createContext();

export default function Shop() {
   const router = useRouter();
   const [queries, setQueries] = useState([]);
   const [filters, setFilters] = useState({ gender: [], price: [], clothing: []});
   const [products, setProducts] = useState(null)
   const [loading, setLoading] = useState(false)
   const itemsRef = useRef(null);
   const [page, setPage] = useState(1);
   const [totalPages, setTotalPages] = useState(1);
   const searchParams = useSearchParams()

   const handleSearch = async(page = 1) => {
      if (queries.length == 0) {
         alert("Please Enter at Least 1 Store")
         return
      } else {
         setLoading(true)

         filters.gender = filters.gender.length ? filters.gender : ["men"];
         filters.clothing = filters.clothing.length ? filters.clothing : ["tops", "bottoms"];
         filters.price = filters.price.length ? filters.price : [25, 200];

         try {
               const items = await axios.post(`http://localhost:4000/product/scrape`, 
                  {stores: queries, gender: filters.gender, clothing: filters.clothing, price: filters.price, page: page})
               setLoading(false)
               console.log(items.data)
               setProducts(items.data)
               sessionStorage.setItem("data", JSON.stringify(items.data))
               sessionStorage.setItem("pages", Math.ceil(items.data.length/60))
               setTotalPages(Math.ceil(items.data.length/60))
               setPage(page)

               router.push(`/shop?page=${page}`, undefined, { shallow: true });
         } catch (e) {
               console.log(e)
         }

         if (itemsRef.current) {
               itemsRef.current.scrollIntoView({ behavior: 'smooth' });
         }
      }
   };

   const fetchPage = async(page) => {
      setLoading(true)

      try {
         // const items = await axios.get(`http://localhost:4000/product/fetch/${page}`)
         // console.log(items.data)
         // setProducts(items.data.products)
         // setTotalPages(items.data.total)
         // setPage(page)
         const data = JSON.parse(sessionStorage.getItem("data"))
         const start = (page - 1) * 60
         const paginated = data.slice(start, start + 60)
         console.log("paginated", paginated)
         

         setProducts(paginated)
         setPage(page)
         setTotalPages(sessionStorage.getItem("pages"))

         router.push(`/shop?page=${page}`, undefined, { shallow: true });
      } catch (e) {
         console.log(e)
      } finally {
         setLoading(false)
      }

      if (itemsRef.current) {
         itemsRef.current.scrollIntoView({ behavior: 'smooth' });
      }
   }

   useEffect(() => {
      const params = new URLSearchParams(searchParams.toString());
      const page = parseInt(params.get('page' || 1), 10);
      fetchPage(page)
   }, [searchParams])


   return (
      <div>
         <filterContext.Provider value={[filters, setFilters]}>
            <main className="relative flex flex-col items-center min-h-screen py-4 font-serif">
               {loading && (
                  <div className="absolute inset-0 flex items-start justify-center h-full bg-white bg-opacity-75 z-50">
                     <div className="loader animate-spin h-10 w-10 border-4 border-t-4 border-gray-300 rounded-full border-t-blue-500"></div>
                  </div>
               )}
               <div className="w-3/4 flex flex-col items-center">
                  <SearchBar queries={queries} setQueries={setQueries} />
                     <Filters />
                  <button
                     type="button"
                     className="bg-color6 text-white py-2 px-8 my-2 text-sm hover:bg-blue-700 transition duration-200"
                     onClick={() => handleSearch(1)}
                  >
                     Search
                  </button>
               </div>
               {products && (
                  <div ref={itemsRef} className="w-full flex flex-col items-center overflow-hidden">
                     <div className="grid grid-cols-1 p-10 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-6xl px-4">
                        {products.map((product) => (
                              <Item key={product.id} item={product} />
                        ))}
                     </div>
                     <div className="flex justify-center mt-4 space-x-4">
                        <button
                              onClick={() => fetchPage(page - 1)}
                              disabled={page <= 1}
                              className={`text-blue-500 hover:underline ${page <= 1 ? 'cursor-not-allowed text-gray-400' : 'cursor-pointer'}`}
                        >
                              Previous
                        </button>
                        <button
                              onClick={() => fetchPage(page + 1)}
                              disabled={page >= totalPages}
                              className={`text-blue-500 hover:underline ${page >= totalPages ? 'cursor-not-allowed text-gray-400' : 'cursor-pointer'}`}
                        >
                              Next
                        </button>
                     </div>
                  </div>
               )}
            </main>
         </filterContext.Provider>
      </div>
   );
}