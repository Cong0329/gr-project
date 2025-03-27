import { useState } from "react";
import ReviewItem from "./ReviewItem";
import ReviewModal from "./ReviewModal";
import ReplyModal from "./ReplyModal";
import RatingSummary from "./RatingSumary";
import ExpandableText from "../medicine_tech/ExpandableText";

export interface Review {
  id: number;
  author: string;
  content: string;
  rating: number | null;
  date: string;
  replies: Reply[];
}

export interface Reply {
  id: number;
  author: string;
  role: string;
  content: string;
  date: string;
}

const ReviewSection: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: 1,
      author: "An Luu",
      content: "Ổn",
      rating: 4,
      date: "2023-06-01",
      replies: [{ id: 1, author: "Vi Trần", role: "Dược Sĩ", content: "Cảm ơn bạn!", date: "2023-06-02" }],
    },
    {
      id: 2,
      author: "Hào Bắc",
      content: "Đây là men tiêu hóa hay men vi sinh?",
      rating: 5,
      date: "2023-06-02",
      replies: [{ id: 2, author: "Mai Phương", role: "Dược Sĩ", content: "Sản phẩm là men vi sinh.", date: "2023-06-03" }],
    },
  ]);

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState<number | null>(null);
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [expanded, setExpanded] = useState(false);
  const isReviews = true;


  const handleReviewSubmit = (content: string, rating: number) => {
    const newReview: Review = {
      id: Date.now(),
      author: "Bạn",
      content,
      rating,
      date: new Date().toISOString().split("T")[0],
      replies: [],
    };
    setReviews([newReview, ...reviews]);
    setShowReviewModal(false);
  };

  const handleReplySubmit = (reviewId: number, replyContent: string) => {
    setReviews((prevReviews) =>
      prevReviews.map((review) =>
        review.id === reviewId
          ? {
            ...review,
            replies: [
              ...review.replies,
              {
                id: Date.now(),
                author: "Bạn",
                role: "Người dùng",
                content: replyContent,
                date: new Date().toISOString().split("T")[0],
              },
            ],
          }
          : review
      )
    );
    setShowReplyModal(false);
  };

  const openReplyModal = (reviewId: number) => {
    setSelectedReviewId(reviewId);
    setShowReplyModal(true);
  };

  const filteredReviews = filterRating
    ? reviews.filter((review) => review.rating === filterRating)
    : reviews;

  return (
    <div className=" mx-auto p-4 bg-white  rounded-xl mt-5 tb:rounded-none">
      {/* Thống kê rating */}
      <p className="text-black font-semibold text-xl border-b-2 pb-2">
        Đánh giá sản phẩm <span className="text-gray-600 text-sm">({reviews.length} đánh giá)</span>
      </p>
      <RatingSummary reviews={reviews} setShowModal={setShowReviewModal} />



      {/* Bộ lọc rating */}
      <div className="mt-4 flex space-x-2 items-center ml:flex-col ml:items-start">
        <p className="text-gray-600 font-medium text-lg">Lọc theo: </p>
        <div className="flex gap-2 ml:text-sm ms:flex-wrap">
          {[5, 4, 3, 2, 1].map((star) => (
            <button
              key={star}
              className={`px-3 ml:px-2 py-1 border rounded-full text-sm  font-semibold ${filterRating === star ? "bg-blue-500 text-white" : "border-2 text-gray-600"
                }`}
              onClick={() => setFilterRating(star)}
            >
              {star} Sao
            </button>
          ))}
          <button className="px-3 py-1 border rounded-lg bg-gray-200" onClick={() => setFilterRating(null)}>
            Tất cả
          </button>
        </div>
      </div>

      {/* Danh sách đánh giá */}
      <div className="mt-4 space-y-4">
        <ExpandableText expanded={expanded} setExpanded={setExpanded}>
          {filteredReviews.map((review) => (
            <ReviewItem key={review.id} review={review} onReply={openReplyModal} isReview={isReviews} />
          ))}
        </ExpandableText>
      </div>


      {/* Modal đánh giá */}
      {showReviewModal && (
        <ReviewModal onClose={() => setShowReviewModal(false)} onSubmit={handleReviewSubmit} isReview={isReviews} />
      )}

      {/* Modal trả lời */}
      {showReplyModal && selectedReviewId !== null && (
        <ReplyModal
          onClose={() => setShowReplyModal(false)}
          onSubmit={(replyContent) => handleReplySubmit(selectedReviewId, replyContent)}
        />
      )}
    </div>
  );
};

export default ReviewSection;
