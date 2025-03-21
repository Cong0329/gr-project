interface ThumbnailSliderProps {
  images: string[];
  currentIndex: number;
  onThumbnailClick: (index: number) => void;
  openModal: (index: number, boolean: boolean) => void;
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
        {images.slice(0, 4).map((src, index) => (
          <div key={index} className="relative">
            {index === 3 && images.length > 4 ? (
              <div
                className={`relative w-28 h-28 cursor-pointer bg-gray-800 rounded-md border-2 flex items-center justify-center text-white  text-sm ${currentIndex === index ? "border-blue-500" : "border-gray-300"} `}
                onClick={() => openModal(3, false)}
              >
                <img
                  src={src}
                  alt={`Thumbnail ${index}`}
                  className="w-full h-full object-cover rounded-md opacity-50"
                />
                <div className="absolute text-center" >
                  <span >Xem thêm {images.length - 3} ảnh</span>
                </div>
              </div>
            ) : (
              <img
                key={index}
                src={src}
                alt={`Thumbnail ${index}`}
                className={`w-28 h-28 border-2 rounded-md cursor-pointer transition ${currentIndex === index ? "border-blue-500" : "border-gray-300"
                  }`}
                onClick={() => onThumbnailClick(index)}
              />
            )}
          </div>

        ))}
      </div>
    </div>
  );
}
