import {Review} from './type'
import {ReviewItem} from './ReviewItem'


export const ReviewsList = ({ 
    reviews, 
    expandedReviews, 
    toggleExpand, 
    replyTexts, 
    handleReplyChange, 
    saveReply 
  }: { 
    reviews: Review[], 
    expandedReviews: string[], 
    toggleExpand: (id: string) => void, 
    replyTexts: {[key: string]: string}, 
    handleReplyChange: (id: string, text: string) => void, 
    saveReply: (id: string) => void 
  }) => {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-700">Danh sách đánh giá ({reviews.length})</h2>
        </div>
        
        {reviews.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            Không tìm thấy đánh giá nào phù hợp với điều kiện tìm kiếm
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {reviews.map((review) => (
              <ReviewItem 
                key={review.id}
                review={review}
                isExpanded={expandedReviews.includes(review.id)}
                onToggle={() => toggleExpand(review.id)}
                replyText={replyTexts[review.id]}
                onReplyChange={handleReplyChange}
                onSaveReply={saveReply}
              />
            ))}
          </div>
        )}
      </div>
    );
  };