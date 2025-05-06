import { useState, useEffect } from 'react';
import { User, Message } from './types';
import UserList from './UserList';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

// Giữ nguyên mockUsers, mockMessages như cũ
const mockUsers: User[] = [
    {
        id: '1',
        name: 'Lindsey Curtis',
        role: 'Content Writer',
        avatar: '/api/placeholder/50/50',
        isOnline: true,
    },
    {
        id: '2',
        name: 'Carla George',
        role: 'Front-end Developer',
        avatar: '/api/placeholder/50/50',
        isOnline: true,
    },
    {
        id: '3',
        name: 'Abram Schleifer',
        role: 'Digital Marketer',
        avatar: '/api/placeholder/50/50',
        isOnline: true,
    },
    {
        id: '4',
        name: 'Lincoln Donin',
        role: 'Project Manager/Product Designer',
        avatar: '/api/placeholder/50/50',
        isOnline: true,
    },
    {
        id: '5',
        name: 'Erin Geidthem',
        role: 'Copywriter',
        avatar: '/api/placeholder/50/50',
        isOnline: true,
    },
    {
        id: '6',
        name: 'Alena Baptista',
        role: 'SEO Expert',
        avatar: '/api/placeholder/50/50',
        isOnline: false,
    },
];

const mockMessages: Record<string, Message[]> = {
    '1': [
        {
            id: 'm1',
            senderId: '1',
            text: 'I want more detailed information.',
            timestamp: '2 hours ago',
            isAdmin: false,
        },
        {
            id: 'm2',
            senderId: 'admin',
            text: "If don't like something, I'll stay away from it.",
            timestamp: '2 hours ago',
            isAdmin: true,
        },
        {
            id: 'm3',
            senderId: 'admin',
            text: 'They got there early, and got really good seats.',
            timestamp: '2 hours ago',
            isAdmin: true,
        },
    ],
};

export default function AdminChatInterface() {
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (selectedUser) {
            setMessages(mockMessages[selectedUser.id] || []);
        }
    }, [selectedUser]);

    const handleSendMessage = () => {
        if (newMessage.trim() && selectedUser) {
            const newMsg: Message = {
                id: `m${Date.now()}`,
                senderId: 'admin',
                text: newMessage,
                timestamp: 'Just now',
                isAdmin: true,
            };
            setMessages([...messages, newMsg]);
            setNewMessage('');
        }
    };

    return (
        <div className="flex h-[570px]">
            <UserList
                users={mockUsers.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()))}
                searchTerm={searchTerm}
                onSearch={setSearchTerm}
                onSelectUser={setSelectedUser}
                selectedUserId={selectedUser?.id}
            />
            <div className="flex-1 flex flex-col">
                {selectedUser ? (
                    <>
                        <ChatHeader user={selectedUser} />
                        <MessageList messages={messages} user={selectedUser} />
                        <MessageInput message={newMessage} onChange={setNewMessage} onSend={handleSendMessage} />
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center bg-gray-50">
                        <div className="text-center">
                            <svg
                                className="mx-auto h-12 w-12 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                ></path>
                            </svg>
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No chat selected</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                Select a conversation from the sidebar to start chatting.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
