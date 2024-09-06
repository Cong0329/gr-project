import { Link } from 'react-router-dom';
import { useState } from 'react';
import { ServiceHover } from './ServiceHover';

export const Service = ({ 
    item, 
    setIsServiceHovered 
}: { 
    item: { name: string, id: number },
    setIsServiceHovered: (isHovered: boolean) => void
}) => {
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseEnter = () => {
        setIsHovered(true);
        setIsServiceHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        setIsServiceHovered(false);
    };

    return (
        <li className='px-3 py-1 text-sm font-semibold mr-2 mb-2 h-full'>
            <button 
                className='w-full text-left group'
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <Link to={`/`} className="flex items-center group-hover:border-b-[3px] pb-2 group-hover:border-blue-700 group-hover:text-blue-600">
                    {item.name}
                    {item.id !== 6 && (
                        <svg
                            className="w-4 h-4 ml-1 transform transition-transform duration-200 group-hover:rotate-180"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    )}
                </Link>
                {isHovered && item.id !== 6 && (
                    <ServiceHover />
                )}
            </button>
        </li>
    )
}
