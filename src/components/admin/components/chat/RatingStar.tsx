import { Star } from "lucide-react";

export const RatingStars = ({ rating }: { rating: number }) => {
    return (
        <div className="flex">
            {[...Array(5)].map((_, index) => (
                <Star
                    key={index}
                    size={16}
                    className={`${index < rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                />
            ))}
        </div>
    );
};