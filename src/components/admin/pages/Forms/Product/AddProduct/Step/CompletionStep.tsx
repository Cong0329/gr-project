import { Link } from "react-router-dom";
import { ProductFormData } from "../ProductCreationForm";
import { Check } from "lucide-react";




interface CompletionStepProps {
    formData: ProductFormData;
}

export const CompletionStep: React.FC<CompletionStepProps> = ({ formData }) => {
    return (
        <div className="text-center py-12">
            <div className="mx-auto w-16 h-16 bg-green-100 flex items-center justify-center rounded-full mb-4">
                <Check size={32} className="text-green-600" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">Tạo sản phẩm thành công!</h2>
            <p className="text-gray-600 mb-6">
                Sản phẩm của bạn đã được tạo và sẽ được hiển thị sau khi được phê duyệt.
            </p>
            <div className="max-w-lg mx-auto p-4 bg-gray-50 rounded-lg border">
                <h3 className="font-medium mb-2">{formData.basicInfo.name}</h3>
                <p className="text-gray-700 mb-1">
                    Số lượng: {formData.basicInfo.quantity.toLocaleString()}
                </p>
                <p className="text-gray-600 text-sm mb-1">
                    Số lượng ảnh: {formData.images.length}
                </p>
                <p className="text-gray-600 text-sm">
                    Số tùy chọn: {formData.options.length}
                </p>
            </div>
            <div className="mt-6">
                <a href="/admin/create-product">
                    <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                        Tiếp tục tạo sản phẩm
                    </button>
                </a>
            </div>
        </div>
    );
};