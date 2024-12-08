import { useState, useRef, useEffect } from 'react';

interface Message {
  text: string;
  fromUser: boolean;
  type: 'text' | 'image';
  imageUrl?: string;
}

const ChatBox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleOpenChat = () => {
    if (!isOpen) {
      setMessages([
        { text: 'Health Pharmacy có thể hỗ trợ gì cho Anh/ Chị ạ?', fromUser: false, type: 'text' },
        { text: 'Cảm ơn Anh/Chị đã liên hệ Nhà thuốc Health Pharmacy!', fromUser: false, type: 'text' },
        { text: 'Để tiện trao đổi, mình vui lòng cho em xin tên được không ạ?', fromUser: false, type: 'text' },
        { text: 'Dạ cảm ơn Anh/Chị đã liên hệ đến Nhà thuốc Health Pharmacy. Khi nào Anh/Chị cần hỗ trợ vui lòng phản hồi lại thông tin, Nhà thuốc sẽ hỗ trợ mình nhanh nhất ạ. Chúc Anh/Chị một ngày tốt lành.', fromUser: false, type: 'text' },
        { text: 'Dạ, hiện tại Health Pharmacy đang cung cấp nhiều tiện ích trên app như miễn phí vận chuyển, tích điểm đổi quà, tra cứu lịch sử tiêm chủng và đặt lịch hẹn trực tuyến, giúp anh/chị dễ dàng quản lý sức khỏe của mình. Em mời anh/chị cài đặt app để nhận ngay những ưu đãi này và tiện theo dõi lịch tiêm ạ.', fromUser: false, type: 'text' },
      ]);
    }
    setIsOpen(!isOpen);
  };

  const handleSendMessage = () => {
    if (input.trim()) {
      setMessages((prevMessages) => [...prevMessages, { text: input, fromUser: true, type: 'text' }]);
      setInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleSendImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setMessages((prevMessages) => [
            ...prevMessages,
            { text: '', fromUser: true, type: 'image', imageUrl: e.target?.result as string },
          ]);
        };
        reader.readAsDataURL(file);
      } else {
        alert('Chỉ cho phép gửi hình ảnh!');
      }
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="fixed bottom-4 right-4 flex flex-col items-end z-[9999]">
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg"
        onClick={handleOpenChat}
      >
        {isOpen ? 'Close Chat' : 'Chat'}
      </button>

      {isOpen && (
        <div className="bg-white shadow-lg rounded-lg w-96 mt-2 flex flex-col h-[600px]">
          <div className="bg-blue-600 text-white p-3 rounded-t-lg">
            <h2 className="text-lg font-semibold">Chat với Dược Sỹ Health Pharmacy</h2>
          </div>

          <div className="flex-1 p-3 overflow-y-auto">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-2 ${msg.fromUser ? 'text-right' : 'text-left'}`}
              >
                {msg.type === 'text' && (
                  <span
                    className={`inline-block px-4 py-2 rounded-lg ${
                      msg.fromUser ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'
                    }`}
                  >
                    {msg.text}
                  </span>
                )}
                {msg.type === 'image' && (
                  <img
                    src={msg.imageUrl}
                    alt={`Message ${index}`}
                    className="inline-block max-w-[200px] rounded-lg shadow-md"
                  />
                )}
              </div>
            ))}
            <div ref={messagesEndRef}></div>
          </div>

          <div className="flex items-center p-3 border-t">
            <div className="relative">
              <button
                className="p-2"
                onClick={() => fileInputRef.current?.click()}
              >
                <i className="fas fa-paperclip text-blue-500"></i>
              </button>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={handleSendImage}
              />
            </div>

            <input
              type="text"
              className="flex-1 mx-3 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button
              className="bg-blue-600 text-white px-3 py-2 rounded-lg"
              onClick={handleSendMessage}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBox;
