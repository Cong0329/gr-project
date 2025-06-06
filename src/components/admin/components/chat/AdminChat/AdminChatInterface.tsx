import { useState, useEffect } from 'react';
import { MessageItem, Message } from '../../../../../redux/reviewsSlice';
import UserList from './UserList';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../../../../redux/store';
import socket from '../../../../../auth/socket';
import {
    getAllMessagesAdmin,
    fetchMessagesAdmin,
    sendMessageAdmin
} from '../../../../../redux/messageAsyncThunk';
import { toast } from 'react-hot-toast';

export default function AdminChatInterface() {
    const dispatch: AppDispatch = useDispatch();
    const { admin } = useSelector((state: RootState) => state.auth);
    const messagesUser = useSelector((state: RootState) => state.reviews.messages);

    const [selectedUser, setSelectedUser] = useState<Message | null>(null);
    const [messages, setMessages] = useState<MessageItem[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    // Load toàn bộ messages khi admin đăng nhập
    useEffect(() => {
        if (admin?.id) {
            dispatch(getAllMessagesAdmin());
        }
    }, [admin?.id, dispatch]);

    // Lắng nghe socket events
    useEffect(() => {
        if (!admin?.id) return;
        const handleAIMessage = (data: MessageItem) => {
            toast('AI vừa gửi tin nhắn');
            dispatch(getAllMessagesAdmin());
            if (selectedUser?.user1?.id === data.User.id) {
                setMessages(prev => [...prev, data]);
            }
        };

        const handleNewMessage = (data: MessageItem) => {
            toast.success('New message received');
            dispatch(getAllMessagesAdmin());
            if (selectedUser?.user1?.id === data.sender_id) {
                setMessages(prev => [...prev, data]);
            }
        };

        const handleUnlock = () => dispatch(getAllMessagesAdmin());
        const handleAdminSend = () => dispatch(getAllMessagesAdmin());

        socket.on('admin_new_message', handleNewMessage);
        socket.on('ai_new_message', handleAIMessage);
        socket.on('messageUnlocked', handleUnlock);
        socket.on('admin_send_message', handleAdminSend);

        return () => {
            socket.off('admin_new_message', handleNewMessage);
            socket.off('ai_new_message', handleAIMessage);
            socket.off('messageUnlocked', handleUnlock);
            socket.off('admin_send_message', handleAdminSend);
        };
    }, [admin?.id, selectedUser, dispatch]);

    // Khi chọn user, lấy messages tương ứng
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
        if (!newMessage.trim() || !selectedUser || !admin) return;

        const tempMessage: MessageItem = {
            id: `${Date.now()}`, // ID tạm
            message_id: `${Date.now()}`,
            sender_id: admin.id,
            content: newMessage,
            image_url: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            User: {
                id: admin.id,
                name: admin.name,
                avatar_url: admin.avatar_url
            }
        };

        setMessages(prev => [...prev, tempMessage]); // hiển thị ngay
        setNewMessage('');

        dispatch(sendMessageAdmin({
            content: newMessage,
            recipientId: selectedUser.user1.id,
        })).then((res: any) => {
            // Optional: Replace tempMessage with res.payload.item if needed
            if (res?.payload?.item) {
                // Optional logic: update message list to replace temp message
            }
        });
    };
    const handleSendImage = (file: File) => {
        if (!selectedUser || !admin) return;

        const tempMessage: MessageItem = {
            id: `${Date.now()}`,
            message_id: `${Date.now()}`,
            sender_id: admin.id,
            content: '', // không có text
            image_url: URL.createObjectURL(file), // hiển thị ngay ảnh
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            User: {
                id: admin.id,
                name: admin.name,
                avatar_url: admin.avatar_url,
            }
        };

        setMessages(prev => [...prev, tempMessage]);

        dispatch(sendMessageAdmin({
            image: file,
            recipientId: selectedUser.user1.id,
        })).then((res: any) => {
            // Optional: Replace tempMessage with res.payload.item if needed
            if (res?.payload?.item) {
                // Optional logic: update message list to replace temp message
            }
        });
    };

    // Lọc user theo searchTerm
    const filteredUsers = messagesUser.filter(u =>
        u.user1?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex h-[570px]">
            <UserList
                users={filteredUsers}
                searchTerm={searchTerm}
                onSearch={setSearchTerm}
                onMessage={setNewMessage}
                onSelectUser={setSelectedUser}
                selectedUserId={selectedUser?.id}
            />
            <div className="flex-1 flex flex-col">
                {selectedUser ? (
                    <>
                        <ChatHeader user={selectedUser} setSelectedUser={setSelectedUser} />
                        <MessageList messages={messages} user={selectedUser} />
                        <MessageInput
                            message={newMessage}
                            onChange={setNewMessage}
                            onSend={handleSendMessage}
                            onImageSend={handleSendImage}
                        />
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
