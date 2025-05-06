import { Review } from "./type";

export const ReplyForm = ({ 
    review,
    reviewId, 
    initialValue, 
    onReplyChange, 
    onSaveReply 
  }: { 
    review: Review,
    reviewId: string, 
    initialValue: string, 
    onReplyChange: (id: string, text: string) => void, 
    onSaveReply: (id: string) => void 
  }) => {
    return (
      <div className="mt-4 pt-4 border-t border-gray-100">
        <textarea
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
          placeholder="Nhập phản hồi của bạn..."
          value={initialValue}
          onChange={(e) => onReplyChange(reviewId, e.target.value)}
        ></textarea>
        
        <div className="mt-2 flex justify-end">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={() => onSaveReply(reviewId)}
          >
            {review.reply ? 'Cập nhật phản hồi' : 'Gửi phản hồi'}
          </button>
        </div>
      </div>
    );
  };