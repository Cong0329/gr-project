import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { reset, uploadImage } from '../../redux/imageSlice';

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
  const dispatch: AppDispatch = useDispatch();
  const { className } = useSelector((state: RootState) => state.image);

  const diseaseInfo: { [key: string]: { description: string, treatment: string } } = {
    "Acne": {
      description: "Acne (mụn trứng cá) là một bệnh da liễu phổ biến, thường xuất hiện khi các lỗ chân lông bị tắc nghẽn bởi dầu, tế bào chết và vi khuẩn. Mụn có thể xuất hiện trên mặt, cổ, lưng, ngực và các vùng da khác. Mặc dù acne chủ yếu ảnh hưởng đến thanh thiếu niên, nhưng người trưởng thành cũng có thể mắc phải. Acne có thể gây ra các vết sẹo và ảnh hưởng đến tâm lý của người bệnh.",
      treatment: "Sử dụng sữa rửa mặt và chăm sóc da: Sữa rửa mặt nhẹ nhàng: Dùng sữa rửa mặt không chứa dầu và phù hợp với loại da của bạn để làm sạch da hàng ngày, giúp loại bỏ dầu thừa và bụi bẩn. Tránh sử dụng xà phòng mạnh vì có thể làm da khô và kích ứng. Sử dụng các sản phẩm trị mụn, Chế độ ăn uống và lối sống lành mạnh"
    },
    "Actinic Keratosis": {
      description: "Bệnh Actinic Keratosis còn được gọi là Bệnh Keratosis Ánh Sáng hoặc Bệnh Tăng Sừng Ánh Sáng là một tình trạng da phổ biến do tiếp xúc lâu dài với ánh sáng mặt trời, dẫn đến sự phát triển của các mảng da thô ráp, khô và có vảy. Mặc dù thường không phải ung thư, nhưng nếu không điều trị, AK có thể tiến triển thành ung thư tế bào đáy hoặc ung thư tế bào vảy.",
      treatment: "Sử dụng Kem hoặc gel chứa fluorouracil (5-FU), Imiquimod, Ingenol mebutate, Liệu pháp ánh sáng (Photodynamic Therapy - PDT), Cryotherapy (Điều trị bằng lạnh), Phẫu thuật cắt bỏ(trường hợp không thể điều trị bằng các phương pháp khác), Điều trị bằng Retinoids (Vitamin A)."
    },
    "Basal Cell Carcinoma": {
      description: "Basal Cell Carcinoma (BCC) là một loại ung thư da phổ biến, phát sinh từ các tế bào đáy của lớp biểu bì da. Mặc dù BCC phát triển chậm và ít khi di căn, nhưng nếu không được điều trị, nó có thể lan rộng và gây tổn thương nghiêm trọng cho mô xung quanh. ",
      treatment: "Phẫu thuật cắt bỏ (Excision Surgery), Phẫu thuật Mohs, Điều trị bằng laser, Xạ trị (Radiation Therapy), Điều trị bằng thuốc (Hóa trị, thuốc ức chế mạch máu)."
    },
    "Eczema": {
      description: "Eczema (hay còn gọi là Viêm da cơ địa) là một bệnh da liễu mãn tính gây viêm, ngứa và đỏ da. Nó có thể ảnh hưởng đến bất kỳ phần nào trên cơ thể và có xu hướng tái phát. Eczema thường xuất hiện từ thời thơ ấu, nhưng cũng có thể phát triển ở người lớn. Mặc dù không lây, eczema có thể gây khó chịu và ảnh hưởng đến chất lượng cuộc sống.",
      treatment: "Sử dụng kem dưỡng ẩm dày hoặc thuốc mỡ để giữ cho da mềm mại và không bị khô, Hạn chế tắm nước nóng, Bôi thuốc corticosteroid, Thuốc ức chế miễn dịch như tacrolimus và pimecrolimus để giảm hoạt động của hệ miễn dịch và giảm viêm. Uống thuốc kháng histamine giúp giảm ngứa và làm dịu các triệu chứng eczema, đặc biệt là vào ban đêm. "
    },
    "Rosacea": {
      description: "Rosacea là một bệnh lý da liễu mãn tính, chủ yếu ảnh hưởng đến vùng da mặt, gây đỏ da, nổi mụn và các mạch máu li ti (mụn trứng cá đỏ). Mặc dù nguyên nhân chính xác của rosacea vẫn chưa rõ ràng, nhưng nó thường xuất hiện ở người trưởng thành, đặc biệt là phụ nữ trong độ tuổi 30-50. Bệnh có thể gây ảnh hưởng đến ngoại hình và tâm lý của người bệnh, nhưng may mắn là có thể kiểm soát được bằng các phương pháp điều trị thích hợp.",
      treatment: "Điều trị bằng thuốc bôi Metronidazole: Là thuốc bôi kháng khuẩn, thường được sử dụng để giảm viêm và ngứa do rosacea.Azelic acid: Là một dạng axit nhẹ giúp giảm mụn và viêm.Ivermectin: Một loại kem bôi giúp giảm các triệu chứng viêm nhiễm và mụn trên da."
    },
  };

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
    dispatch(reset());
  };

  const handleSendMessage = () => {
    if (input.toLocaleLowerCase().includes('cách')) {
      if (className) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: input, fromUser: true, type: 'text' },
          { text: diseaseInfo[className].treatment, fromUser: false, type: 'text' }
        ]);
      }
    } else if (input.trim()) {
      setMessages((prevMessages) => [...prevMessages, { text: input, fromUser: true, type:'text' }]);  
    }
    setInput('');
    
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
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; // Lấy file đầu tiên từ danh sách files
    if (file) {
      dispatch(uploadImage(file));
    } else {
      // Nếu không có file, hiển thị cảnh báo
      alert("Vui lòng chọn một ảnh!");
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleUpload(e);  // Gọi handleUpload để upload ảnh
    handleSendImage(e);  // Gọi handleSendImage để gửi ảnh
  };
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  // Định nghĩa kiểu cho diseaseInfo
  


  useEffect(() => {
    if (className) {
      // Kiểm tra nếu className có trong đối tượng diseaseInfo
      if (diseaseInfo[className]) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: `Đây là bệnh ${className}`, fromUser: false, type: 'text' },
          { text: diseaseInfo[className].description, fromUser: false, type: 'text' }
        ]);
      }
    }
  }, [className]);



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
                    className={`inline-block px-4 py-2 rounded-lg ${msg.fromUser ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'
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
                onChange={handleChange}
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
