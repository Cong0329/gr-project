import { useState } from "react";
import { FaXmark } from "react-icons/fa6";

interface ReplyModalProps {
  onClose: () => void;
  onSubmit: (replyContent: string) => void;
}

const ReplyModal: React.FC<ReplyModalProps> = ({ onClose, onSubmit}) => {
  const [reply, setReply] = useState("");

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
      <div className="bg-white p-4 rounded-xl w-1/3">
        <div className="flex">
          <h2 className="text-lg font-semibold grow">Trả lời</h2>
          <FaXmark className="flex-none " size={20} onClick={onClose} />
        </div>
        <textarea className="w-full border p-2 my-2 rounded-xl" rows={4} value={reply} onChange={(e) => setReply(e.target.value)} placeholder="Nhập phản hồi..." />
        <button className="px-4 py-2 bg-blue-600 text-white rounded-full w-full font-medium" onClick={() => { onSubmit(reply); onClose(); }}>Gửi</button>
      </div>
    </div>
  );
};

export default ReplyModal;
