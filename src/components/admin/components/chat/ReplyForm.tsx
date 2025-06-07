import { Review, Reply } from "./type";

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
    onSaveReply: (id: string, reply: Reply) => void 
  }) => {
    return (
      <div className="mt-4 pt-4 border-t border-gray-100 ">
        <textarea className="w-full"
          rows={4}
          placeholder="Nhập phản hồi của bạn..."
          value={initialValue}
          onChange={(e) => onReplyChange(reviewId, e.target.value)}
        ></textarea>
        
        <div className="mt-2 flex justify-end">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={() => onSaveReply(reviewId, {
              id: review.reply?.id ?? '',
              reply: initialValue,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              admin: {
                id: review.user.id,
                name: review.user.name,
                email: review.user.email
              }
            })}
          >
            {review.reply ? 'Cập nhật phản hồi' : 'Gửi phản hồi'}
          </button>
        </div>
      </div>
    );
  };