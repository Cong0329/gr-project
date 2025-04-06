
import React from 'react';

interface UserProfileProps {
  name: string;
  phone: string;
}

const UserProfile: React.FC<UserProfileProps> = ({ name, phone }) => {
  return (
    <div className="bg-blue-600 p-4 flex flex-col items-center justify-center text-white rounded-xl">
      <div className="w-20 h-20 bg-blue-400 rounded-full mb-2 flex items-center justify-center">
        <div className="text-white text-4xl">👤</div>
      </div>
      <div className="text-xl font-bold">{name}</div>
      <div>{phone}</div>
    </div>
  );
};

export default UserProfile;