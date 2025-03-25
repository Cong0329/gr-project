import { Review } from "./ReviewSection";


interface ReviewItemProps {
    review: Review;
    onReply: (reviewId: number) => void;
    isReview:boolean;
}

const ReviewItem: React.FC<ReviewItemProps> = ({ review, onReply, isReview }) => {
    return (
        <div className="p-2">

            <div className="flex items-center gap-2">
                <img src="https://i.imgur.com/OAArH4H.jpeg" alt="" className="rounded-full w-10 h-10 object-cover" />
                <p className="font-bold text-gray-600">{review.author} {isReview && `- ${review.rating} ⭐`}</p>
            </div>
            <div className="ml-12">
                <p>{review.content}</p>
                <div className="flex gap-2 text-sm font-semibold">
                    <p className="text-gray-600">{review.date}</p>
                    <button className="text-blue-500" onClick={() => onReply(review.id)}>Trả lời</button>
                </div>
            </div>





            <div className="mt-2 ml-16 border-l pl-4 space-y-2">
                {review.replies.map((reply) => (
                    <div key={reply.id}>
                        <div className="flex items-center gap-2">
                            <img src="https://i.imgur.com/OAArH4H.jpeg" alt="" className="rounded-full w-10 h-10 object-cover" />
                            <p className="font-bold text-gray-600">{reply.author}</p>
                        </div>
                        <div className="ml-12">
                            <p>{reply.content}</p>
                            <p>{reply.date}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ReviewItem;
