import { Review } from "../../../redux/reviewsSlice";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import logo from "../../../assets/logo.png";
interface ReviewItemProps {
    review: Review;
    isReview: boolean;
}

const ReviewItem: React.FC<ReviewItemProps> = ({ review, isReview }) => {
    const { user } = useSelector((state: RootState) => state.auth);
    const reviewDate = new Date(review.createdAt).toLocaleDateString();
    const replyDate = review.reply ? new Date(review.reply.createdAt).toLocaleDateString() : null;


    return (
        <div className="p-2  border-gray-200 last:border-b-0">
            <div className="flex items-center gap-2">
                <img src={review.user.avatar_url || "https://via.placeholder.com/40"} alt={review.user.name} className="rounded-full w-10 h-10 object-cover" />
                <p className="font-bold text-gray-600">{review.user.id === user?.id ? "Bạn" : review.user.name} {isReview && review.rating !== null && `- ${review.rating} ⭐`}</p>
            </div>
            <div className="ml-12">
                <p>{review.comment}</p>
                <div className="flex gap-2 text-sm font-semibold">
                    <p className="text-gray-600">{reviewDate}</p>
                </div>
            </div>

            {review.reply && (
                <div className="mt-2 ml-16 border-l pl-4 space-y-2">
                    <div>
                        <div className="flex items-center gap-2">
                            <img src={logo} alt="" className="rounded-full w-10 h-10 object-contain" />
                            <p className="font-bold text-gray-600">Healthy Pharmacy<span className="text-sm text-gray-500 font-normal">(Dược Sĩ)</span></p>
                        </div>
                        <div className="ml-12">
                            <p>{review.reply.reply}</p>
                            {replyDate && <p className="text-gray-600 text-sm">{replyDate}</p>}
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default ReviewItem;