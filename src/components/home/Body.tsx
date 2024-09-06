import { useState } from 'react';
import { NavLink } from '../navlink/NavLink';
import { Banner } from "./Banner";

export const Body = () => {
    const [isServiceHovered, setIsServiceHovered] = useState(false);

    return (
        <main className="flex-1 bg-gray-100">
            <div className="container mx-auto">
                <NavLink setIsServiceHovered={setIsServiceHovered} />
            </div>
            <div className={`container mx-auto relative ${isServiceHovered ? 'bg-blue-950 bg-opacity-30 z-5' : ''}`}>
                <Banner />
            </div>
        </main>
    )
}
