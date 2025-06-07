// AdminReviewInterface.tsx
import { useState } from 'react';
import { Review, Reply } from './interfaces';
import { ReviewItem } from './ReviewItem';

// Dữ liệu mẫu đã được cập nhật
const sampleReviews: Review[] = [
  {
    id: "1",
    comment: "Sản phẩm tốt, chất lượng vải đẹp...",
    rating: 4,
    createdAt: "2025-05-01T00:00:00Z",
    updatedAt: "2025-05-01T00:00:00Z",
    reply: {
      id: "reply-1",
      reply: "Cảm ơn bạn đã đánh giá...",
      createdAt: "2025-05-01T01:00:00Z",
      updatedAt: "2025-05-01T01:00:00Z",
      admin: {
        id: "admin-1",
        name: "Admin",
        email: "admin@example.com"
      }
    },
    user: {
      id: "user-1",
      name: "Nguyễn Văn A",
      email: "user@example.com",
      avatar_url: "https://example.com/avatar.jpg"
    },
    product: {
      id: "product-1",
      name: "Áo thun nam"
    }
  },
  // Thêm các review khác...
];

export default function AdminReviewInterface() {
  const [reviews, setReviews] = useState<Review[]>(sampleReviews);
  const [searchTerm] = useState('');
  const [filterStatus] = useState<'all' | 'answered' | 'unanswered'>('all');
  const [filterRating] = useState<number | null>(null);
  // const answeredCount = reviews.filter(review => review.isAnswered).length;
  // const unansweredCount = reviews.filter(review => !review.isAnswered).length;

  // Hàm lọc đánh giá
  const filteredReviews = reviews.filter(review => {
    // Lọc theo từ khóa tìm kiếm
    const matchesSearch = review.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          review.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          review.product.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Lọc theo trạng thái trả lời
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'answered' && !!review.reply) ||
                         (filterStatus === 'unanswered' && !review.reply);
    
    // Lọc theo số sao
    const matchesRating = filterRating === null || review.rating === filterRating;
    
    return matchesSearch && matchesStatus && matchesRating;
  });
  // Các hàm lọc và xử lý dữ liệu giữ nguyên...
  const handleSaveReply = (reviewId: string, reply: Reply) => {
    const updatedReviews = reviews.map(review => {
      if (review.id === reviewId) {
        return {
          ...review,
          reply,
          updatedAt: new Date().toISOString()
        };
      }
      return review;
    });
    
    setReviews(updatedReviews);
    alert(`Đã ${reply.id ? 'cập nhật' : 'thêm'} phản hồi thành công`);
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      {/* Phần header và filter giữ nguyên... */}
      
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-700">Danh sách đánh giá</h2>
        </div>
        
        {filteredReviews.map((review) => (
          <ReviewItem 
            key={review.id}
            review={review}
            onSaveReply={handleSaveReply}
            isExpanded={false}
            onToggle={() => {}}
            replyText=""
            onReplyChange={() => {}}
         
          />
        ))}
      </div>
    </div>
  );
}