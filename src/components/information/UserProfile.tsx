
import React from 'react';

interface UserProfileProps {
    name: string;
    phone: string;
    img: string;
}

const UserProfile: React.FC<UserProfileProps> = ({ name, phone, img }) => {
  return (
    <div className="bg-blue-600 p-4 flex flex-col items-center justify-center text-white rounded-xl">
     <img src={img} alt="" className='w-20 h-20 rounded-full' />
      <div className="text-xl font-bold">{name}</div>
      <div>{phone}</div>
    </div>
  );
};

export default UserProfile;