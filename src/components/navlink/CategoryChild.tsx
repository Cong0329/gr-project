import { ServiceHoverProps } from "./ServiceHover";
import medicine from '../../assets/category-icons/medicine.png';

const medicines : ServiceHoverProps[] = [
    {
      id: 1,
      name: "Vitamin & Khoáng chất",
      image: medicine
    },
    {
      id: 2,
      name: "Vitamin D",
      image: medicine
    },
    {
      id: 3,
      name: "Vitamin C",
        image: medicine
    },
    {
      id: 4,
      name: "Vitamin E",
      image: medicine
    },
    {
      id: 5,
      name: "Vitamin B",
      image: medicine
    }
  ];
  


export const CategoryChild = () => {
    return (
        <div className="grid grid-cols-3 gap-2 w-full border-b-2 border-gray-300 pb-4">
            {medicines.map((medicine: ServiceHoverProps) => (           
                <div className="flex items-center bg-white rounded-lg p-4 h-16" key={medicine.id}>
                    <img src={medicine.image} alt={medicine.name} className="w-6 h-6 mr-2" />
                    <span>{medicine.name}</span>
                </div>
            ))}
        </div>
    )
}
