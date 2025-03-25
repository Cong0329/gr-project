import { useState } from "react";
import { FaXmark } from "react-icons/fa6";

interface ReviewModalProps {
  onClose: () => void;
  onSubmit: (content: string, rating: number) => void;
  isReview: boolean
}

const ReviewModal: React.FC<ReviewModalProps> = ({ onClose, onSubmit, isReview }) => {
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(5);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-40">
      <div className="bg-white p-4 rounded-xl shadow-md w-1/3">
        <div className="flex justify-items-stretch">
          
          <h2 className="text-lg grow font-bold">{isReview ? "Đánh giá sản phẩm" : "Hỏi đáp"} </h2>
          <FaXmark className="flex-none " size={20} onClick={onClose} />
        </div>
        <textarea className="w-full border rounded-xl p-2 my-2" rows={4} value={content} onChange={(e) => setContent(e.target.value)} placeholder="Nhập đánh giá..." />
        {!isReview ? null : (
          <select className="w-full border p-2 my-2 rounded-xl" value={rating} onChange={(e) => setRating(Number(e.target.value))}>
            {[5, 4, 3, 2, 1].map((star) => <option key={star} value={star}>{star} ⭐</option>)}
          </select>
        )}
        <div className="w-full mt-3">
          <button className="w-full h-10 font-medium bg-blue-600 text-lg text-white rounded-full" onClick={() => { onSubmit(content, rating); onClose(); }}>Gửi</button>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
