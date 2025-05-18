import { ServiceHoverProps } from "./ServiceHover";


  


export const CategoryChild = ({items}: {items: ServiceHoverProps[]}) => {
    return (
        <div className="grid grid-cols-3 gap-2 w-full border-b-2 border-gray-300 pb-4">
            {items.map((item: ServiceHoverProps) => (           
                <div className="flex items-center bg-white rounded-lg p-4 h-16" key={item.id}>
                    <img src={item.image} alt={item.name} className="w-6 h-6 mr-2" loading="lazy" />
                    <span>{item.name}</span>
                </div>
            ))}
        </div>
    )
}
