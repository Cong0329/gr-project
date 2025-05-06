
import CreateBlog from "../../Blog/CreateBlog";
import { Title } from "../../Blog/type";

interface DetailedInfoStepProps {
    updateDetailedInfo: (title: string, descriptions: Title[]) => void;
}


export const DetailedInfoStep: React.FC<DetailedInfoStepProps> = ({ updateDetailedInfo }) => {
    return (
        // <div className="space-y-4">
        //     <h2 className="text-xl font-semibold mb-4">Chi tiết sản phẩm</h2>
        //     <p className="text-gray-600 mb-4">
        //         Mô tả chi tiết về sản phẩm của bạn. Hãy cung cấp đầy đủ thông tin để khách hàng hiểu rõ về sản phẩm.
        //     </p>
        //     <textarea
        //         value={value}
        //         onChange={onChange}
        //         className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        //         placeholder="Nhập mô tả chi tiết về sản phẩm..."
        //         rows={12}
        //     ></textarea>
        //     <p className="text-sm text-gray-500">
        //         Nhập ít nhất 50 ký tự để tiếp tục. Hiện tại: {value.length} ký tự
        //     </p>
        // </div>
        <div>
            <CreateBlog updateDetailedInfo={updateDetailedInfo}/>
        </div>
    );
};