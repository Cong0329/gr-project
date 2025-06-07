import { ProductImage } from "../ProductCreationForm";
import { ImageThumbnail } from "../ImageThumbnail";
import { Upload } from "lucide-react";

interface ImagesStepProps {
  images: ProductImage[];
  onAddImage: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (id: string) => void;
}

export const ImagesStep: React.FC<ImagesStepProps> = ({ images, onAddImage, onRemoveImage }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Thêm ảnh sản phẩm</h2>
      <div className="border-2 border-dashed border-gray-300 p-6 rounded-lg text-center">
        <label className="flex items-center justify-center mx-auto mb-2 p-3 rounded-full h-12 w-12 bg-blue-100 text-blue-600 cursor-pointer">
          <Upload size={24} />
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={onAddImage}
            className="hidden"
          />
        </label>
        <p className="text-gray-600">Nhấn để tải lên ảnh sản phẩm</p>
        <p className="text-gray-500 text-sm mt-1">(Hỗ trợ các định dạng: JPG, PNG, WEBP)</p>
      </div>


      {images.length > 0 && (
        <div className="mt-4">
          <h3 className="font-medium mb-2">Ảnh đã tải lên ({images.length})</h3>
          <div className="grid grid-cols-6 gap-2">
            {images.map((image) => (
              <ImageThumbnail
                key={image.id}
                image={image}
                onRemove={onRemoveImage}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};