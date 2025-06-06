import { useState, useEffect } from "react";
import ReviewItem from "./ReviewItem";
import ReviewModal from "./ReviewModal";
import RatingSummary from "./RatingSumary";
import ExpandableText from "../medicine_tech/ExpandableText";
import { useSelector, useDispatch } from "react-redux";
import { RootState,AppDispatch } from "../../../redux/store";
import { createReview } from "../../../redux/reviewsAsyncThunk";
import { toast } from "react-toastify";
import { Review } from "../../../redux/reviewsSlice";

const ReviewSection: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch:AppDispatch = useDispatch();
  const { product, review } = useSelector((state: RootState) => state.products);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [expanded, setExpanded] = useState(false);
  const isReviews = true;

  useEffect(() => {
    if (review?.length > 0) {
      setReviews(review);
    } else {
      setReviews([]);
    }
  }, [review]);

  const handleReviewSubmit = (content: string, rating: number) => {
    if (content.trim() === "") {
      toast.error("Vui lòng nhập đánh giá");
      return;
    }
    if (rating === null) {
      toast.error("Vui lòng chọn đánh giá");
      return;
    }
    if (!user?.id) {
      toast.error("Vui lòng đăng nhập để đánh giá");
      return;
    }

    const newReview: Review = {
      id: String(Date.now()),
      comment: content, // Đổi từ content -> comment
      rating,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      reply: null, // Thay replies bằng reply (null khi mới tạo)
      user: {
        id: user?.id || "", // Giả định user đã đăng nhập
        name: user?.name || "Bạn", // Lấy từ user nếu có
        email: user?.email || "",
        avatar_url: user?.avatar_url || "",
      },
      product: {
        id: product.id,
        name: product.name || "Tên sản phẩm", // Lấy từ product thực tế
      }
    };

    setReviews([newReview, ...reviews]);
    dispatch(createReview({
      productId: product.id,
      rating: rating,
      comment: content
    }));
    toast.success("Đánh giá đã được gửi");
    setShowReviewModal(false);
  };




  const filteredReviews = filterRating
    ? reviews.filter((review) => parseFloat(review.rating) === filterRating)
    : reviews;

  return (
    <div className=" mx-auto p-4 bg-white  rounded-xl mt-5 tb:rounded-none" id="reviews">
      {/* Thống kê rating */}
      <p className="text-black font-semibold text-xl border-b-2 pb-2">
        Đánh giá sản phẩm <span className="text-gray-600 text-sm">({reviews.length} đánh giá)</span>
      </p>
      <RatingSummary reviews={reviews} setShowModal={setShowReviewModal} user={user} />



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
            <ReviewItem key={review.id} review={review} isReview={isReviews} />
          ))}
        </ExpandableText>
      </div>


      {/* Modal đánh giá */}
      {showReviewModal && (
        <ReviewModal onClose={() => setShowReviewModal(false)} onSubmit={handleReviewSubmit} isReview={isReviews} />
      )}

    </div>
  );
};

export default ReviewSection;
