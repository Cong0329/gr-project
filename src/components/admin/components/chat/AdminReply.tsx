import { MessageCircle } from "lucide-react";
import { Reply } from "./type";

export const AdminReply = ({ reply }: { reply: Reply }) => {
    return (
        <div className="mt-4 bg-blue-50 p-3 rounded-md">
            <div className="flex items-center mb-2">
                <MessageCircle size={16} className="text-blue-600 mr-2" />
                <span className="font-medium text-blue-700">Phản hồi của {reply.admin.name}</span>
                <span className="ml-2 text-sm text-gray-500">
                    {new Date(reply.createdAt).toLocaleDateString('vi-VN')}
                </span>
            </div>
            <p className="text-gray-700">{reply.reply}</p>
        </div>
    );
};