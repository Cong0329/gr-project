import { useState, useEffect } from 'react';
import { MessageItem, Message } from '../../../../../redux/reviewsSlice';
import UserList from '../AdminChat/UserList';
import ChatHeader from '../AdminChat/ChatHeader';
import MessageList from '../AdminChat/MessageList';
import MessageInput from '../AdminChat/MessageInput';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../../../../redux/store';
import socket from '../../../../../auth/socket';
import {
    getAllMessageUser,
    sendMessageDoctor,
    fetchMessagesAdmin,
} from '../../../../../redux/messageAsyncThunk';
import { toast } from 'react-toastify';

export default function UserChatInterface() {
    const dispatch: AppDispatch = useDispatch();
    const { user } = useSelector((state: RootState) => state.auth);
    const messagesUser = useSelector((state: RootState) => state.reviews.messages);

    const [selectedUser, setSelectedUser] = useState<Message | null>(null);
    const [messages, setMessages] = useState<MessageItem[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    useEffect(() => {
        if (user?.id) {
            socket.emit('join_room', user.id);
            dispatch(getAllMessageUser({ id: user.id }));
        }
    }, [user?.id, dispatch]);
    useEffect(() => {
        if (!user?.id) return;

        const handleNewMessage = (data: MessageItem) => {
            dispatch(getAllMessageUser({ id: user.id }));
            if (selectedUser?.user2?.id === data.sender_id) {
                setMessages(prev => [...prev, data]);
                toast.info('Bạn có tin nhắn mới');

            }
        };


        socket.on('new_doctor_message', handleNewMessage);


        return () => {
            socket.off('new_doctor_message', handleNewMessage);
        };
    }, [user?.id, selectedUser, dispatch]);

    useEffect(() => {
        if (selectedUser) {
            dispatch(fetchMessagesAdmin(selectedUser.id)).then((res: any) => {
                if (res?.payload) {
                    setMessages(res.payload);
                }
            });
        } else {
            setMessages([]);
        }
    }, [selectedUser, dispatch]);

    // Gửi tin nhắn
    const handleSendMessage = () => {
        if (!newMessage.trim() || !selectedUser || !user) return;

        const tempMessage: MessageItem = {
            id: `${Date.now()}`, // ID tạm
            message_id: `${Date.now()}`,
            sender_id: user.id,
            content: newMessage,
            image_url: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            User: {
                id: user.id,
                name: user.name,
                avatar_url: user.avatar_url
            }
        };

        setMessages(prev => [...prev, tempMessage]); // hiển thị ngay
        setNewMessage('');

        dispatch(sendMessageDoctor({
            content: newMessage,
            recipientId: selectedUser.user2.id,
            id: user.id,
        })).then((res: any) => {
            // Optional: Replace tempMessage with res.payload.item if needed
            if (res?.payload?.item) {
                // Optional logic: update message list to replace temp message
            }
        });
    };


    // Lọc user theo searchTerm
    const filteredUsers = messagesUser.filter(u =>
        u.user2?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex h-[570px] w-full ">
            <div className={`${selectedUser ? 'ml:hidden' : 'ml:block'} ml:w-full`}>
                <UserList
                    users={filteredUsers}
                    searchTerm={searchTerm}
                    onSearch={setSearchTerm}
                    onMessage={setNewMessage}
                    onSelectUser={setSelectedUser}
                    selectedUserId={selectedUser?.id}
                />
            </div>

            <div className="flex-1 flex flex-col  ">
                {selectedUser ? (
                    <div
                        className={`flex flex-col h-full
                                ml:fixed ml:inset-0 ml:z-50 ml:bg-white ml:flex ml:flex-col
                                ml:h-full
                                `}
                    >
                        <ChatHeader user={selectedUser} setSelectedUser={setSelectedUser} />
                        <MessageList messages={messages} user={selectedUser} />
                        <MessageInput
                            message={newMessage}
                            onChange={setNewMessage}
                            onSend={handleSendMessage}
                        />
                    </div>
                ) : (
                    <div className="flex-1 flex items-center ml:hidden justify-center bg-gray-50">
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
                                />
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
