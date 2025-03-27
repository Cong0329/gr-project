import { useState } from "react";
import { Review } from "../medicine_reviews/ReviewSection";
import ReviewItem from "../medicine_reviews/ReviewItem";
import ReviewModal from "../medicine_reviews/ReviewModal";
import ReplyModal from "../medicine_reviews/ReplyModal";
import ExpandableText from "../medicine_tech/ExpandableText";


export const MedicineComment = () => {
    const [reviews, setReviews] = useState<Review[]>([
        {
            id: 1,
            author: "An Luu",
            content: "Ổn",
            rating: null,
            date: "2023-06-01",
            replies: [{ id: 1, author: "Vi Trần", role: "Dược Sĩ", content: "Cảm ơn bạn!", date: "2023-06-02" }],
        },
        {
            id: 2,
            author: "Hào Bắc",
            content: "Đây là men tiêu hóa hay men vi sinh?",
            rating: null,
            date: "2023-06-02",
            replies: [{ id: 2, author: "Mai Phương", role: "Dược Sĩ", content: "Sản phẩm là men vi sinh.", date: "2023-06-03" }],
        },
    ]);

    const [showReviewModal, setShowReviewModal] = useState(false);
    const [showReplyModal, setShowReplyModal] = useState(false);
    const [selectedReviewId, setSelectedReviewId] = useState<number | null>(null);
    const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
    const [expanded, setExpanded] = useState(false);
    const isReviews = false;


    const handleReviewSubmit = (content: string) => {
        const newReview: Review = {
            id: Date.now(),
            author: "Bạn",
            content,
            rating: null,
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

    const sortedReviews = [...reviews].sort((a, b) => {
        if (sortOrder === "newest") {
            return new Date(b.date).getTime() - new Date(a.date).getTime(); // Mới nhất
        } else {
            return new Date(a.date).getTime() - new Date(b.date).getTime(); // Cũ nhất
        }
    });

    return (
        <div className=" mx-auto p-4 bg-white  rounded-xl mt-5 tb:rounded-none">
            {/* Thống kê rating */}
            <div className="border-b-2 pb-2 font-semibold">
                <p className="text-black text-xl  ">
                    Hỏi đáp <span className="text-gray-600 text-sm">({reviews.length} bình luận)</span>
                </p>
                <button
                    className="mt-3 bg-blue-700 text-white px-4 py-2 rounded-full"
                    onClick={() => setShowReviewModal(true)}
                >
                    Gửi bình luận
                </button>
            </div>



            {/* Bộ lọc rating */}
            <div className="mt-4 flex space-x-2 items-center">
                <p className="text-gray-600 font-medium text-lg">Lọc theo: </p>
                <button
                    className={`px-4 py-2 border rounded-full text-sm font-semibold ${sortOrder === "newest"
                        ? "bg-blue-500 text-white"
                        : "border-2 text-gray-600"
                        }`}
                    onClick={() => setSortOrder("newest")}
                >
                    Mới nhất
                </button>

                <button
                    className={`px-4 py-2 border rounded-full text-sm font-semibold ${sortOrder === "oldest"
                        ? "bg-blue-500 text-white"
                        : "border-2 text-gray-600"
                        }`}
                    onClick={() => setSortOrder("oldest")}
                >
                    Cũ nhất
                </button>
            </div>

            {/* Danh sách đánh giá */}
            <div className="mt-4 space-y-4">
                <ExpandableText expanded={expanded} setExpanded={setExpanded}>
                    {sortedReviews.map((review) => (
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
    )
}