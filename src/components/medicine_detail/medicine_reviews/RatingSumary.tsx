interface RatingSummaryProps {
  reviews: { rating: number }[];
  setShowModal: (value: boolean) => void;
}

const RatingSummary: React.FC<RatingSummaryProps> = ({ reviews, setShowModal }) => {
  const totalReviews = reviews.length;
  const ratingCounts = [5, 4, 3, 2, 1].map(
    (star) => reviews.filter((r) => r.rating === star).length
  );

  const averageRating =
    totalReviews > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)
      : "0.0";

  return (
    <div className=" bg-white flex pt-3 border-b-2 pb-2">
      <div className="">
        <p className="text-gray-600 text-sm font-semibold">Trung bình</p>
        <div className="flex items-center space-x-2">
          <span className="text-3xl font-semibold">{averageRating}</span>
          <span className="text-yellow-500 text-xl">⭐</span>
        </div>
        <button
          className="mt-3 bg-blue-700 text-white px-4 py-2 rounded-full"
          onClick={() => setShowModal(true)}
        >
          Gửi đánh giá
        </button>
      </div>
      <div className="space-y-1 ml-5 text-sm">
        {[5, 4, 3, 2, 1].map((star, index) => (
          <div key={star} className="flex items-center">
            <span className="w-10">{star} ⭐</span>
            <div className="w-52 h-1.5 bg-gray-300 mx-2 rounded">
              <div
                className="h-1.5 bg-orange-400 rounded"
                style={{
                  width: totalReviews ? `${(ratingCounts[index] / totalReviews) * 100}%` : "0%",
                }}
              ></div>
            </div>
            <span>{ratingCounts[index]}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RatingSummary;
