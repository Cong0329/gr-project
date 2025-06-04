import { useLocation } from 'react-router-dom';
import ChatBox from './chatbox';

const ChatBoxWrapper = () => {
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith('/admin');
  const isDoctorRoute = location.pathname.startsWith('/doctor');

  // Giả sử bạn chỉ cho phép ChatBox hiển thị ở các route sau:
  const allowedPaths = ['medicine-detail/:slug', '/medicine-search', '/profile', '/cart', '/booking-home', '/booking-home/specialty-list', '/booking-home/specialty-detail/:name', '/booking-home/onlex-list', '/booking-home/onlex-detail/:name', '/booking-home/generalex-list', '/booking-home/generalex-detail/:name', '/booking-home/medicaltest-list', '/booking-home/medicaltest-detail/:name', '/booking-home/payment', '/booking-home/payment-success', '/booking-home/payment-cancel', '/'];

  const isAllowedPath = allowedPaths.some(path => location.pathname.startsWith(path));

  return (!isAdminRoute && !isDoctorRoute && isAllowedPath) ? <ChatBox /> : null;
};

export default ChatBoxWrapper;
