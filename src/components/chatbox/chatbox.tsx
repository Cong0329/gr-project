import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { reset, uploadImage } from '../../redux/imageSlice';
import { fetchMessagesUser, sendMessageUser, sendAIMessage } from '../../redux/messageAsyncThunk';
import socket from '../../auth/socket';
import { MessageItem, markAsRead, openChatbox } from '../../redux/reviewsSlice';
import ReactMarkdown from 'react-markdown';
import { imageToFile } from '../../components/chatbox/convertUrl';
import { X } from 'lucide-react';

const ChatBox = () => {
  const { chatbox } = useSelector((state: RootState) => state.reviews);
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const dispatch: AppDispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { predict } = useSelector((state: RootState) => state.image);
  const { notifying } = useSelector((state: RootState) => state.reviews);
  const isDetailRoute = location.pathname.startsWith('/medicine-detail');
  const isCartRoute = location.pathname.startsWith('/cart');
  const isChatRoute = location.pathname.startsWith('/profile/chat');
  
  useEffect(() => {
    if (user?.id && chatbox) {
      dispatch(fetchMessagesUser({ id: user.id })).then((res: any) => {
        if (res?.payload) {
          setMessages(res.payload);
        }
      });
    }
  }, [dispatch, user, chatbox]);

  useEffect(() => {
    if (predict.class_name) {
      let content;
      if (predict.class_name === "Unknown") {
        content = "Không thể nhận diện bệnh"
      } else {
        content = `
                      🧾 **Kết quả phân tích hình ảnh**
                      - **Bệnh**: ${predict.class_name}
                      - **Mô tả**: ${predict.description}
                      - **Điều trị**: ${predict.treatment}
                      - **Thuốc gợi ý**: ${predict.suggested_meds.map(
        med => `[${med}](medicine-search?name=${encodeURIComponent(med)})`
      ).join(', ')}
                        - **Chuyên khoa**: [${predict.department}](booking-home/onlex-detail/${encodeURIComponent(predict.department)})
                        `.trim();
      }
      dispatch(sendAIMessage({ content }));
    }
  }, [predict, dispatch]);


  useEffect(() => {
    if (user?.id) {
      socket.emit('join_room', user?.id);
      socket.on('new_message', (data: MessageItem) => {
        setMessages(prev => [...prev, data]);
        dispatch(markAsRead(true));
      });
      socket.on('ai_user_new_message', (data: MessageItem) => {
        setMessages(prev => [...prev, data]);
        dispatch(markAsRead(true));
      });
    }
    return () => {
      socket.off('new_message');
      socket.off('ai_user_new_message');
    };
  }, [user, dispatch]);

  const handleLogin = () => {
    window.location.href = `${import.meta.env.VITE_NODEJS_BACKEND_URL}/auth/google`;
  };

  const handleOpenChat = () => {
    if (!chatbox) setMessages([]);
    dispatch(openChatbox());
    dispatch(reset());
    dispatch(markAsRead(false));
  };

  const handleSendMessage = async () => {
    const lastMessage = messages[messages.length - 1];
    const isQuestionAboutDisease = /bệnh.*(gì|nào|gọi|sao|chữa|là|không)/i.test(input);
    if (!input.trim()) return;
    const newMessage: MessageItem = {
      id: '',
      message_id: '',
      sender_id: user.id,
      content: input,
      image_url: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      User: {
        id: user.id,
        name: user.name,
        avatar_url: user.avatar_url
      }
    };

    setMessages(prev => [...prev, newMessage]);
    setInput('');
    dispatch(sendMessageUser({ content: input }));
    if (isQuestionAboutDisease && lastMessage.image_url) {
      const file = await imageToFile(lastMessage?.image_url || '', 'image.png');
      dispatch(reset());
      dispatch(uploadImage(file));
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSendMessage();
  };

  const handleSendImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        const newMessage: MessageItem = {
          id: '',
          message_id: '',
          sender_id: user.id,
          content: null,
          image_url: reader.result as string,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          User: {
            id: user.id,
            name: user.name,
            avatar_url: user.avatar_url
          }
        };
        setMessages(prev => [...prev, newMessage]);
      };
      reader.readAsDataURL(file);

    } else {
      alert('Chỉ cho phép gửi hình ảnh!');
    }
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) dispatch(sendMessageUser({ image: file }));
    else alert("Vui lòng chọn một ảnh!");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleUpload(e);
    handleSendImage(e);
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className={`fixed bottom-4 right-4 flex flex-col items-end z-[9999]  ${isDetailRoute ? 'tb:bottom-20' : ''} ml:bottom-0 ml:right-0`}>
      <button className={`bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg ${(isDetailRoute || isCartRoute || isChatRoute) ? 'tb:hidden' : ''}`} onClick={handleOpenChat}>
        {chatbox ? 'Close Chat' : 'Chat'}
      </button>

      {chatbox && (
        <div className="bg-white shadow-lg rounded-lg w-96 mt-2 flex flex-col h-[600px] tb:h-[500px] ml:w-screen ml:h-screen">
          <div className="bg-blue-600 text-white p-3 rounded-t-lg tb:flex tb:justify-between tb:items-center">
            <h2 className="text-lg font-semibold">Chat với Dược Sỹ Health Pharmacy</h2>
            <button className="text-white hidden tb:block" onClick={handleOpenChat}><X size={20}/></button>
          </div>

          {user?.id ? (
            <>
              <div className="flex-1 p-3 overflow-y-auto">
                {messages.map((msg, index) => (
                  <div key={msg.id || index} className={`mb-2  ${msg.sender_id === user.id ? 'text-right' : 'text-left'}`}>

                    {msg.content && (
                      <ReactMarkdown
                        components={{
                          p: ({  children }) => (
                            <div
                              className={`inline-block px-4 py-2 rounded-lg whitespace-pre-line ${msg.sender_id === user.id ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'
                                }`}
                            >
                              {children}
                            </div>
                          ),
                          a: ({  ...props }) => (
                            <a {...props} target="_blank" rel="noopener noreferrer" className="underline text-blue-700" />
                          )
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    )}

                    {msg.image_url && (
                      <img
                        src={msg.image_url}
                        alt={`Message ${index}`}
                        loading="lazy"
                        className="inline-block max-w-[200px] rounded-lg shadow-md mt-1"
                      />
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef}></div>
              </div>

              <div className="flex items-center p-3 border-t">
                <button className="p-2" onClick={() => fileInputRef.current?.click()}>
                  <i className="fas fa-paperclip text-blue-500"></i>
                </button>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleChange}
                />

                <input
                  type="text"
                  className="flex-1 mx-3 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Type your message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <button className="bg-blue-600 text-white px-3 py-2 rounded-lg" onClick={handleSendMessage}>
                  Send
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col gap-2 items-center justify-center h-full">
              <p className="text-gray-500">Vui lòng đăng nhập để chat</p>
              <button onClick={handleLogin} className="bg-blue-600 text-white px-3 py-2 rounded-lg">
                Đăng nhập
              </button>
            </div>
          )}
        </div>
      )}
      {notifying && (
        <div className="absolute right-0 top-0 z-[9999] bg-yellow-500 w-3 h-3 shadow-lg rounded-full">
        </div>
      )}

    </div>

  );
};

export default ChatBox;
