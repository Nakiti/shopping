
import { FaTrash } from "react-icons/fa";

const CartItem = ({ item, handleDelete }) => {

   const handleClick = () => {
      window.open(item.link, "_blank")
   }

   return (
      <div key={item.cartitem_id} className="relative flex items-center border-b border-gray-200 py-4">
         <button 
         className="absolute top-0 right-0 py-1 px-3 rounded hover:bg-red-700"
         onClick={() => handleDelete(item.cartitem_id)}
         >
         <FaTrash />
         </button>
         <div className='relative group cursor-pointer' onClick={handleClick} >
            <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-lg mr-4" />
            <div className="flex flex-col flex-grow">
                  <h2 className="text-lg font-medium text-gray-800">{item.name}</h2>
                  {/* <p className="text-sm text-gray-600">{item.brand}</p> */}
                  <p className="text-lg font-semibold text-gray-900 mt-2">{item.price}</p>
            </div>
            <span className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-max opacity-0 group-hover:opacity-100 transition-opacity bg-gray-700 text-white text-xs rounded py-1 px-2">
                  Open on {item.brand}
            </span>
         </div>
      </div>
   );
};

export default CartItem;