"use client"

import { useState } from 'react';

const suggestionsList = [
   {
      name: "H&M",
      link: "https://www2.hm.com/",
      logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOSWOhkrtrLKgKz35SOCEsZV-v2q_yeKpMgw&s"
   }, 
   {
      name: "Abercrombie & Fitch",
      link: "https://www.abercrombie.com/",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Abercrombie_%26_Fitch_logo.svg/422px-Abercrombie_%26_Fitch_logo.svg.png"
   }, {
      name: "Hollister",
      link: "https://www.hollisterco.com/",
      logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRG17pGMnj7HXJMDZ5NtRDRPd7bw2QiNgbn8A&s"
   }
];

export default function SearchBar(props) {
   const [inputValue, setInputValue] = useState('');
   const [filteredSuggestions, setFilteredSuggestions] = useState([]);

   const handleInputChange = (e) => {
      console.log(props)

      const value = e.target.value;
      setInputValue(value);
      if (value.trim() !== '') {
      const filtered = suggestionsList.filter(suggestion =>
         suggestion.name.toLowerCase().startsWith(value.toLowerCase()) && !props.queries.includes(suggestion.name)
      );
      setFilteredSuggestions(filtered);
      } else {
      setFilteredSuggestions([]);
      }
   };

   const handleKeyPress = (event) => {
      if (event.key === 'Enter' && inputValue.trim() !== '') {
      if (suggestionsList.includes(inputValue.trim().toLowerCase()) && !props.queries.includes(inputValue.trim())) {
         props.setQueries(prev => [...prev, inputValue.trim()]);
         setInputValue('');
         setFilteredSuggestions([]);
      } else {
         console.log("Not a valid site")
      }
      event.preventDefault();
      } else if (event.key === "Backspace" && inputValue === '') {
         props.setQueries(prev => prev.slice(0, -1))

         console.log(props.queries)
      }

      console.log(event.key)
   };

   const handleBackSpace = (event) => {
      if (event.key == 'Backspace') {
         const temp = props.queries.pop()
         props.setQueries([temp])
      }

      event.preventDefault()
   }

   const handleSuggestionClick = (suggestion) => {
      props.setQueries([...props.queries, suggestion]);
      setInputValue('');
      setFilteredSuggestions([]);
   };

   const removeQuery = (index) => {
      props.setQueries(props.queries.filter((_, i) => i !== index));
   };

   return (
      <div className="flex flex-col items-center w-full max-w-4xl p-4">
      <div className="flex flex-wrap align-center items-center w-full px-4 bg-white py-2 text-sm border border-gray-300 focus-within:border-blue-500 relative">
         {props.queries && props.queries.map((query, index) => (
            <div
            key={index}
            className="flex items-center bg-color6 text-white px-2 py-2 rounded-full mr-2 mb-0"
            >
            <span>{query.name}</span>
            <button
               type="button"
               className="ml-2 text-white bg-color6"
               onClick={() => removeQuery(index)}
            >
               &times;
            </button>
            </div>
         ))}
         <input
            type="text"
            className="flex-grow outline-none bg-transparent px-2 py-1"
            placeholder="Search for Stores"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
         />
         {filteredSuggestions.length > 0 && (
            <ul className="absolute left-0 right-0 top-full bg-white border border-gray-300 rounded-lg mt-2 z-10">
            {filteredSuggestions.map((suggestion, index) => (
               <li
                  key={index}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                  onClick={() => handleSuggestionClick(suggestion)}
               >
                  {suggestion.name}
               </li>
            ))}
            </ul>
         )}
      </div>
      </div>
   );
}