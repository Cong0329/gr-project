import { ProductImage } from "./ProductCreationForm";
import { X } from "lucide-react";

interface ImageThumbnailProps {
    image: ProductImage;
    onRemove: (id: string) => void;
  }
  
export const ImageThumbnail: React.FC<ImageThumbnailProps> = ({ image, onRemove }) => {
    return (
      <div className="relative rounded-lg border w-40 p-1 overflow-hidden group">
        <img
          src={image.image}
          alt="Product"
          className=" h-20 w-40 object-cover"
          loading="lazy"
        />
        <button
          type="button"
          onClick={() => onRemove(image.id)}
          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <X size={16} />
        </button>
      </div>
    );
  };
    