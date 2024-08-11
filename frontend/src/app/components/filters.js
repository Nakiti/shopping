import Dropdown from "./dropdown"
import Radio from "./radio"


const Filters = (props) => {
      const genders = [{id: 0, value: "men", label: "Men"}, {id: 1, value: "women", label: "Women"}]

      const clothing  = [{id: 0, value: "tops", label: "Tops"}, {id: 1, value: "bottoms", label: "Bottoms"}]

      // const colors = [{id: 0, value: "", label: "Color"}]

      const prices = [{id: 0, value: 25, label: "$0-25"}, {id: 1, value: 50, label: "$25-50"}, {id: 2, value: 75, label: "$50-75"}, {id: 3, value: 100, label: "$75-100"}]

      return (
         <div className="flex flex-row justify-between w-5/12 my-2 space-x-4">
            <Radio items={genders} id={"gender"}/>
            <Dropdown items={clothing} id={"clothing"} />
            <Dropdown items={prices} id={"price"} />
         </div>
      )
}

export default Filters;