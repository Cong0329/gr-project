import { Message } from "../../../../../redux/reviewsSlice";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../../../../redux/store";
import { unlockedMessages } from "../../../../../redux/messageAsyncThunk";
import { useRef } from "react";

interface Props {
    users: Message[];
    searchTerm: string;
    onSearch: (term: string) => void;
    onMessage: (message: string) => void;
    onSelectUser: (user: Message) => void;
    selectedUserId?: string;
}

export default function UserList({ users, searchTerm, onSearch, onMessage, onSelectUser, selectedUserId }: Props) {
    const { admin } = useSelector((state: RootState) => state.auth);
    const userMe = useSelector((state: RootState) => state.auth.user);
    const dispatch: AppDispatch = useDispatch();
    const role = useSelector((state: RootState) => state.auth.role);
    const previousSelectedUserRef = useRef<Message | null>(null);

    const handleUserClick = (user: Message) => {
        const isUnlocked = user.locked_by === null || user.locked_by === admin?.id;

        if (isUnlocked && role.includes('ROLE_ADMIN')) {
            const prevUser = previousSelectedUserRef.current;

            // Nếu user trước đó tồn tại, khác user hiện tại, và đang bị lock → unlock
            if (
                prevUser &&
                prevUser.id !== user.id &&
                prevUser.locked_by !== null
            ) {
                dispatch(unlockedMessages(prevUser.id));
            }

            onSelectUser(user);
            onMessage('');
            previousSelectedUserRef.current = user;
        } else if (user.user1?.id === userMe?.id || user.user2?.id === admin?.id || role.includes('ROLE_DOCTOR')) {
            onSelectUser(user);
            onMessage('');
            previousSelectedUserRef.current = user;
        }
    };

    return (
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-[570px] tb:w-[250px] ml:w-full">
            <div className="p-4 border-b border-gray-200">
                <h1 className="text-2xl font-bold text-gray-800">Tin nhắn</h1>
            </div>

            {/* Search Bar */}
            <div className="p-4">
                <div className="relative">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => onSearch(e.target.value)}
                        placeholder="Search..."
                        className="w-full py-2 pl-10 pr-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* User List */}
            <div className="flex-1 overflow-y-auto">
                {users.length === 0 ? (
                    <div className="text-center py-8">Chưa có tin nhắn.</div>
                ) : (
                    users.map((user) => (
                        <div
                            key={user.id}
                            className={`p-4 flex items-center cursor-pointer ${selectedUserId === user.id ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
                            onClick={() => handleUserClick(user)}
                        >
                            {(role.includes('ROLE_DOCTOR') || role.includes('ROLE_ADMIN')) ? (
                                <>
                                    <img className="w-12 h-12 rounded-full object-cover" src={user.user1?.avatar_url} alt={user.user1?.name} />
                                    <div className="ml-4">
                                        <h2 className={` ${user.locked_by === null || user.locked_by !== admin?.id ? 'text-black font-semibold' : 'text-gray-500'}`}>
                                            {user.user1?.name}
                                        </h2>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <img className="w-12 h-12 rounded-full object-cover" src={user.user2?.avatar_url} alt={user.user2?.name} />
                                    <div className="ml-4">
                                        <h2 className={` ${user.locked_by === null || user.locked_by !== admin?.id ? 'text-black font-semibold' : 'text-gray-500'}`}>
                                            {user.user2?.name}
                                        </h2>
                                    </div>
                                </>
                            )}

                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
