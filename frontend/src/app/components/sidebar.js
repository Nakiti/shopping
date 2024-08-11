
import React from 'react';
import Link from 'next/link';


const Sidebar = ({ isOpen, onClose, items }) => {
   return (
      <div
         className={`fixed top-0 right-0 w-80 h-full bg-white z-50 transform transition-transform ${
         isOpen ? 'translate-x-0' : 'translate-x-full'
         }`}
      >
         <div className="flex items-center justify-between p-4 border-b">
         <h2 className="text-lg font-semibold">Shopping Cart</h2>
         <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
               &times;
         </button>
         </div>
         <div className="p-4 h-3/4 overflow-y-auto">
               {items.length === 0 ? (
                  <p className="text-center text-gray-500">Your cart is empty</p>
               ) : (
                  items.map((item) => (
                  <div key={item.cartitem_id} className="flex items-center space-x-4 mb-4">
                     <img src={item.image} alt={item.name} className="w-16 h-16 object-cover" />
                     <div className="flex-1">
                     <h3 className="text-md font-medium">{item.name}</h3>
                     <p className="text-sm text-gray-500">{item.price}</p>
                     </div>
                     <div>
                     </div>
                  </div>
                  ))
               )}
         </div>
         <div className="p-4 border-t">
               <Link href={"/cart"} >
                  
                  <button className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600">View Cart</button>
               </Link>
         </div>
      </div>
   );
};

export default Sidebar;
