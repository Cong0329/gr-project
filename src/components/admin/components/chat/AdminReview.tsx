import { useState, useEffect } from "react";
import { StatisticCard } from "./StaticCard";
import { FilterBar } from "./FilterBar";
import { ReviewsList } from "./ReviewList";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../../../redux/store";
import { getReviews, replyReview, upadateReplyReview } from "../../../../redux/reviewsAsyncThunk";
import { toast } from "react-toastify";
import { Review, addReview } from "../../../../redux/reviewsSlice";
import socket from "../../../../auth/socket";

export default function AdminReviewInterface() {
  const dispatch: AppDispatch = useDispatch();
  const { status } = useSelector((state: RootState) => state.reviews);
  const admin = useSelector((state: RootState) => state.auth.admin);
  const adminReviews = useSelector((state: RootState) => state.reviews.reviews);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [expandedReviews, setExpandedReviews] = useState<string[]>([]);
  const [replyTexts, setReplyTexts] = useState<{ [key: string]: string }>({});
  useEffect(() => {
    dispatch(getReviews());
  }, [dispatch]);
  useEffect(() => {
    setReviews(adminReviews);
  }, [adminReviews]);
    useEffect(() => {
      socket.emit("register-admin");
  
      socket.on("new-review", (data) => {
        const newNotification = {
          id: Date.now(),
          user: {id: data.user.id, name: data.user.name, email: data.user.email, avatar_url: data.user.avatar_url},
          product: {id: data.product.id, name: data.product.name},
          comment: data.comment,
          rating: data.rating,
          createdAt: data.createdAt,
          updatedAt: data.createdAt,
          reply: null
        };
  
        dispatch(addReview(newNotification));
      });
  
      return () => {
        socket.off("new-review");
      };
    }, [dispatch]);



  // Đếm số lượng đánh giá đã trả lời và chưa trả lời
  const answeredCount = reviews.filter(review => review.reply !== null).length;
  const unansweredCount = reviews.filter(review => review.reply === null).length;

  // Hàm lọc đánh giá
  const filteredReviews = reviews.filter(review => {
    // Lọc theo từ khóa tìm kiếm
    const matchesSearch = review.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.product.name.toLowerCase().includes(searchTerm.toLowerCase());

    // Lọc theo trạng thái trả lời
    const matchesStatus = filterStatus === 'all' ||
      (filterStatus === 'answered' && review.reply !== null) ||
      (filterStatus === 'unanswered' && review.reply === null);

    // Lọc theo số sao
    const matchesRating = filterRating === null || parseInt(review.rating) === filterRating;

    return matchesSearch && matchesStatus && matchesRating;
  });

  // Hàm mở rộng/thu gọn đánh giá
  const toggleExpand = (id: string) => {
    if (expandedReviews.includes(id)) {
      setExpandedReviews(expandedReviews.filter(reviewId => reviewId !== id));
    } else {
      setExpandedReviews([...expandedReviews, id]);
    }
  };

  // Hàm xử lý thay đổi nội dung trả lời
  const handleReplyChange = (id: string, text: string) => {
    setReplyTexts({
      ...replyTexts,
      [id]: text
    });
  };

  // Hàm lưu trả lời
  const saveReply = (id: string) => {
    if (!replyTexts[id]) {
      toast.warning('Vui lòng nhập nội dung phản hồi');
      return;
    }

    const currentDate = new Date().toISOString();
    const adminInfo = {
      id: admin.id,
      name: admin.name,
      email: admin.email
    };

    const targetReview = reviews.find(review => review.id === id);
    const hadPreviousReply = !!targetReview?.reply;
    const replyId = targetReview?.reply?.id;

    const updatedReviews = reviews.map(review => {
      if (review.id === id) {
        // Nếu đã có reply, cập nhật nội dung
        if (review.reply) {
          return {
            ...review,
            reply: {
              ...review.reply,
              reply: replyTexts[id],
              updatedAt: currentDate
            }
          };
        }
        // Nếu chưa có reply, tạo mới
        else {
          return {
            ...review,
            reply: {
              id: `r${Date.now()}`,
              reply: replyTexts[id],
              createdAt: currentDate,
              updatedAt: currentDate,
              admin: adminInfo
            }
          };
        }
      }
      return review;
    });
    // console.log(id, replyTexts[id]);
    setReviews(updatedReviews);
    if (hadPreviousReply) {
      dispatch(upadateReplyReview({replyId: replyId, reply: replyTexts[id]}));
    }
    else {
      dispatch(replyReview({id, reply: replyTexts[id]}));
    }
    // Hiển thị thông báo thành công
    toast.success(`Đã ${hadPreviousReply ? 'cập nhật' : 'gửi'} phản hồi cho đánh giá #${id}`);
  };

  return (
    <>
      <div className="bg-gray-50 min-h-screen p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Quản lý đánh giá sản phẩm</h1>

          {/* Thống kê */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <StatisticCard title="Tổng số đánh giá" value={reviews.length} color="text-blue-600" />
            <StatisticCard title="Đã trả lời" value={answeredCount} color="text-green-600" />
            <StatisticCard title="Chưa trả lời" value={unansweredCount} color="text-red-600" />
          </div>

          {/* Bộ lọc và tìm kiếm */}
          <FilterBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            filterStatus={filterStatus}
            onStatusChange={setFilterStatus}
            filterRating={filterRating}
            onRatingChange={setFilterRating}
          />

          {/* Danh sách đánh giá */}
          <ReviewsList
            reviews={filteredReviews}
            expandedReviews={expandedReviews}
            toggleExpand={toggleExpand}
            replyTexts={replyTexts}
            handleReplyChange={handleReplyChange}
            saveReply={saveReply}
          />
        </div>
      </div>
      {(status === "loading" || status === "failed") &&
        <div className="fixed inset-0 z-[1000000] flex items-center justify-center bg-black bg-opacity-50">
          <div className="flex flex-col items-center">
            {status === "loading" ? (
              <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
            )}
            <p className="mt-4 text-white text-sm">
              {status === "loading" ? "Đang tải..." : "Tải thất bại"}
            </p>
          </div>
        </div>
      }
    </>

  );
}