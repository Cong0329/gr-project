import { Review, Reply } from "./type";
import { AdminReply } from "./AdminReply";
import { ReplyForm } from "./ReplyForm";
import { RatingStars } from "./RatingStar";
import { Check, ChevronDown, ChevronUp, X } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";


export const ReviewItem = ({
  review,
  isExpanded,
  onToggle,
  replyText,
  onReplyChange,
  onSaveReply
}: {
  review: Review,
  isExpanded: boolean,
  onToggle: () => void,
  replyText: string,
  onReplyChange: (id: string, text: string) => void,
  onSaveReply: (reviewId: string, reply: Reply) => void
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center">
            <div className="flex mr-2">
              <img
                src={review.user.avatar_url}
                alt={review.user.name}
                className="w-8 h-8 rounded-full"
              />
            </div>
            <div>
              <span className="font-medium text-gray-800">{review.user.name}</span>
              <span className="mx-2 text-gray-400">•</span>
              <span className="text-sm text-gray-500">{formatDate(review.createdAt)}</span>
              <span className="mx-2 text-gray-400">•</span>
              <span className="text-sm text-gray-500">{formatDistanceToNow(new Date(review.createdAt), { addSuffix: true, locale: vi })}</span>
              <RatingStars rating={review.rating} />
            </div>
          </div>

          <div className="mt-2">
            <p className="text-gray-600">{review.comment}</p>
          </div>

          <div className="mt-2 text-sm">
            <span className="font-medium text-gray-700">Sản phẩm:</span> {review.product.name}
          </div>

          {review.reply && <AdminReply reply={review.reply} />}
        </div>

        <div className="flex items-center ml-4">
          {review.reply ? (
            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
              <Check size={12} className="mr-1" />
              Đã trả lời
            </span>
          ) : (
            <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full flex items-center">
              <X size={12} className="mr-1" />
              Chưa trả lời
            </span>
          )}

          <button
            onClick={onToggle}
            className="ml-2 p-1 rounded-full hover:bg-gray-100"
          >
            {isExpanded ? (
              <ChevronUp size={20} className="text-gray-500" />
            ) : (
              <ChevronDown size={20} className="text-gray-500" />
            )}
          </button>
        </div>
      </div>

      {/* Phần trả lời */}
      {isExpanded && (
        <ReplyForm
          review={review}
          reviewId={review.id}
          initialValue={replyText}
          onReplyChange={onReplyChange}
          onSaveReply={onSaveReply}
        />
      )}
    </div>
  );
};