import { useDispatch } from 'react-redux';
import { Message } from '../../../../../redux/reviewsSlice';
import { X } from 'lucide-react';
import { AppDispatch } from '../../../../../redux/store';
import { unlockedMessages } from '../../../../../redux/messageAsyncThunk';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../redux/store';
interface Props {
    user: Message;
    setSelectedUser: (user: Message | null) => void;
}

export default function ChatHeader({ user, setSelectedUser }: Props) {
    const dispatch: AppDispatch = useDispatch();
    const { role } = useSelector((state: RootState) => state.auth);
    const isDoctor = role.includes('ROLE_DOCTOR');
    const isAdmin = role.includes('ROLE_ADMIN');
    const handleUnlockedMessages = () => {
        if (isAdmin) {
            dispatch(unlockedMessages(user.id));

        }
        setSelectedUser(null);
    };
    return (
        <div className="p-4 bg-white border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center">
                <div className="relative">
                    <img
                        className="w-10 h-10 rounded-full object-cover"
                        src={`${(isAdmin || isDoctor) ? user.user1.avatar_url : user.user2.avatar_url}`}
                        alt={user.user1.name}
                    />
                    {/* {user.User.isOnline && (
                        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
                    )} */}
                </div>
                <div className="ml-3">
                    <h2 className="font-semibold text-gray-800">{(isAdmin || isDoctor) ? user.user1.name : user.user2.name}</h2>
                    {/* <p className="text-sm text-gray-600">{user.User.role}</p> */}
                </div>
            </div>
            <div className="flex items-center space-x-3">
                <button className="text-gray-500 hover:text-gray-700">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                    </svg>
                </button>
                <button className="text-gray-500 hover:text-gray-700">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                    </svg>
                </button>
                <button className="text-gray-500 hover:text-gray-700">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path>
                    </svg>
                </button>
                <button className="text-gray-500 hover:text-gray-700" onClick={handleUnlockedMessages}>
                    <X className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
}
