import { useState, useEffect } from "react";
import { FaAngleRight } from "react-icons/fa6";
import { Link } from "react-router-dom";
export const OrderCustom = ({ orders }: { orders: number[] }) => {
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 1000)
    }, [])
    let content;
    if (isLoading) {
        content = (
            <>
                {[1, 2, 3].map((i) => (
                    <div key={i} className="mt-4 bg-white rounded-lg border animate-pulse">
                        {/* Skeleton UI */}
                        <div className="px-4 pt-4 pb-2">
                            <div className="flex justify-between items-center border-b pb-2">
                                <div className="flex items-center gap-1 font-semibold">
                                    <div className="h-5 w-36 bg-gray-200 rounded-md"></div>
                                    <div className="mx-1 text-gray-300">•</div>
                                    <div className="h-5 w-32 bg-gray-200 rounded-md"></div>
                                    <div className="mx-1 text-gray-300">•</div>
                                    <div className="h-5 w-20 bg-gray-200 rounded-md"></div>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-2 h-2 bg-gray-200 rounded-md mr-2"></div>
                                    <div className="h-5 w-20 bg-gray-200 rounded-md"></div>
                                </div>
                            </div>
                            <div className="pt-4 pb-2 flex justify-between items-start">
                                <div className="flex items-center">
                                    <div className="h-16 w-16 bg-gray-200 rounded-md p-2"></div>
                                    <div className="ml-4">
                                        <div className="h-10 w-[500px] bg-gray-200 rounded-md"></div>
                                        <div className="h-5 w-32 bg-gray-200 rounded-md mt-2"></div>
                                    </div>
                                </div>
                                <div className="h-5 w-20 bg-gray-200 rounded-md"></div>
                                <div className="h-5 w-20 bg-gray-200 rounded-md"></div>
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="h-5 w-28 bg-gray-200 rounded-md"></div>
                                <div className="h-5 w-36 bg-gray-200 rounded-md mt-2"></div>
                            </div>
                            <div className="border-t pt-2 mt-2 flex justify-end">
                                <div className="h-10 w-40 bg-gray-200 rounded-full"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </>
        );
    } else if (orders.length > 0) {
        content = (
            <>
                {orders.map((i) => (
                    <div key={i} className="mt-2 bg-white rounded-lg border">
                        <div className="px-4 pt-4 pb-2">
                            <div className="flex justify-between items-center border-b pb-2">
                                <div className="flex items-center gap-1 font-semibold">
                                    <span>Đơn hàng 01/04/2025</span>
                                    <span className="mx-1 text-gray-300">•</span>
                                    <span className="text-gray-500">Giao hàng tận nơi</span>
                                    <span className="mx-1 text-gray-300">•</span>
                                    <span className="text-gray-600">#7212016</span>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                                    <div className="text-red-500 font-medium">Đã hủy</div>
                                </div>
                            </div>
                            <Link to={"/order"}>
                                <div className="pt-4 pb-2 flex justify-between">
                                    <div className="flex items-center">
                                        <img
                                            src="https://i.imgur.com/89zuGgW.png"
                                            alt=""
                                            loading="lazy"
                                            className="w-16 h-16 border rounded-lg p-2"
                                        />
                                        <div className="ml-4">
                                            <div className="font-semibold text-sm w-[500px] line-clamp-2">
                                                Thực phẩm bảo vệ sức khỏe OMEGA 3 PLUS Kenko hỗ trợ não bộ, thị lực và sức khỏe tim mạch (120 viên)
                                            </div>
                                            <div className="text-gray-500 w-full line-clamp-1">+1 sản phẩm khác</div>
                                        </div>
                                    </div>
                                    <div className="font-bold">920.000đ</div>
                                    <div className="text-gray-500">x1 Hộp</div>
                                </div>
                            </Link>
                            <Link to={'/'}>
                                <div className="flex justify-between items-center">
                                    <div className="text-blue-700 font-medium gap-1 flex items-center">
                                        Xem chi tiết <FaAngleRight />
                                    </div>
                                    <div className="text-right flex gap-2 font-semibold">
                                        <div className="text-gray-500">Thành tiền:</div>
                                        <div className="text-blue-700 ">948.000đ</div>
                                    </div>
                                </div>
                            </Link>

                            <div className="border-t pt-2 mt-2 flex justify-end">
                                <button className="text-white bg-blue-700 px-16 py-2 font-medium gap-1 flex items-center rounded-full">
                                    Mua lại
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </>
        );
    } else {
        content = (
            <div className="flex items-center justify-center flex-col p-12">
                <div className="w-96 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <img src="https://imgur.com/wJtkO6K.png" alt="" className="w-full" loading="lazy" />
                </div>
                <div className="text-lg font-medium mb-1">Bạn chưa có đơn hàng nào.</div>
                <div className="text-gray-500">Cùng khám phá hàng ngàn sản phẩm tại Nhà thuốc FPT Long Châu nhé!</div>
                <button className="font-semibold text-white bg-blue-600 px-16 py-2 rounded-full mt-4">Khám phá ngay</button>
            </div>
        );
    }

    return <div>{content}</div>;
}
