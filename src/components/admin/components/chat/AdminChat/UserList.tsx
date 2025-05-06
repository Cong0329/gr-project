import { User } from './types';

interface Props {
    users: User[];
    searchTerm: string;
    onSearch: (term: string) => void;
    onSelectUser: (user: User) => void;
    selectedUserId?: string;
}

export default function UserList({ users, searchTerm, onSearch, onSelectUser, selectedUserId }: Props) {
    return (
        <div>
            <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-[570px]">
                <div className="p-4 border-b border-gray-200">
                    <h1 className="text-2xl font-bold text-gray-800">Chats</h1>
                </div>

                {/* Search Bar */}
                <div className="p-4">
                    <div className="relative">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => onSearch(e.target.value)}
                            placeholder="Search..."
                            className="w-full py-2 pl-10 pr-4 border rounded-lg"
                        />
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                            </svg>
                        </div>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {users.map((user) => (
                        <div
                            key={user.id}
                            className={`p-4 flex items-center cursor-pointer hover:bg-gray-50 ${selectedUserId === user.id ? 'bg-blue-50' : ''}`}
                            onClick={() => onSelectUser(user)}
                        >
                            <img className="w-12 h-12 rounded-full" src={user.avatar} />
                            <div className="ml-4">
                                <h2 className="font-semibold">{user.name}</h2>
                                <p className="text-sm text-gray-600">{user.role}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}
