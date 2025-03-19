interface ThumbnailSliderProps {
    images: string[];
    currentIndex: number;
    onThumbnailClick: (index: number) => void;
    openModal: (index: number) => void;
  }
  
  export default function ThumbnailSlider({
    images,
    currentIndex,
    onThumbnailClick,
    openModal,
  }: ThumbnailSliderProps) {
    return (
      <div className="mt-4 flex items-center space-x-2">
        <div className="flex space-x-2">
          {images.slice(0, 3).map((src, index) => (
            <img
              key={index}
              src={src}
              alt={`Thumbnail ${index}`}
              className={`w-20 h-20 border-2 rounded-md cursor-pointer transition ${
                currentIndex === index ? "border-blue-500" : "border-gray-300"
              }`}
              onClick={() => onThumbnailClick(index)}
            />
          ))}
        </div>
  
        {/* Nút "Xem thêm" */}
        {images.length > 3 && (
          <button
            className="bg-gray-200 px-3 py-2 rounded-md text-sm hover:bg-gray-300 transition"
            onClick={() => openModal(3)}
          >
            Xem thêm {images.length - 3} ảnh
          </button>
        )}
      </div>
    );
  }
  