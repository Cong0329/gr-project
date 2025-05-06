import { useLocation } from 'react-router-dom';
import ChatBox from './chatbox';

const ChatBoxWrapper = () => {
  const location = useLocation();
  
  // Kiểm tra xem route hiện tại có phải là admin route không
  const isAdminRoute = location.pathname.startsWith('/admin'); // Thay '/admin' bằng prefix route của admin

  return !isAdminRoute ? <ChatBox /> : null;
};

export default ChatBoxWrapper;