
export const Footer = () => {
    return (
        <footer className="bg-blue-600 text-white py-6">
            <div className="container mx-auto px-6">
                {/* Phần trên */}
                <div className="flex flex-col md:flex-row items-center justify-between border-b border-white pb-4">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        ⚬ Xem hệ thống 1987 nhà thuốc trên toàn quốc
                    </h2>
                    <button className="bg-white text-blue-600 px-4 py-2 rounded-full font-semibold shadow-md">
                        Xem danh sách nhà thuốc
                    </button>
                </div>

                {/* Phần nội dung */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-sm py-6">
                    <div>
                        <h3 className="font-semibold mb-2">VỀ CHÚNG TÔI</h3>
                        <ul className="space-y-1">
                            <li>Giới thiệu</li>
                            <li>Hệ thống cửa hàng</li>
                            <li>Giấy phép kinh doanh</li>
                            <li>Chính sách đặt cọc</li>
                            <li>Chính sách nội dung</li>
                            <li>Chính sách đổi trả thuốc</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-2">DANH MỤC</h3>
                        <ul className="space-y-1">
                            <li>Thực phẩm chức năng</li>
                            <li>Dược mỹ phẩm</li>
                            <li>Thuốc</li>
                            <li>Chăm sóc cá nhân</li>
                            <li>Đặt thuốc online</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-2">TÌM HIỂU THÊM</h3>
                        <ul className="space-y-1">
                            <li>Góc sức khỏe</li>
                            <li>Tra cứu thuốc</li>
                            <li>Bệnh thường gặp</li>
                            <li>Bệnh viện</li>
                            <li>Tin tức tuyển dụng</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-2">TỔNG ĐÀI (8:00 - 22:00)</h3>
                        <ul className="space-y-1">
                            <li>Tư vấn mua hàng: <span className="font-bold">18006928</span></li>
                            <li>Trung tâm vắc xin: <span className="font-bold">18006928</span></li>
                            <li>Góp ý, khiếu nại: <span className="font-bold">18006928</span></li>
                        </ul>
                    </div>
                </div>

                {/* Phần dưới */}
                <div className="flex flex-col md:flex-row items-center justify-between text-xs border-t border-white pt-4">
                    <p>
                        © 2007 - 2025 Công ty Cổ Phần Dược Phẩm FPT Long Châu | Địa chỉ: 379-381 Hai Bà Trưng, P. Võ Thị Sáu, Q.3, TP. HCM
                    </p>
                    <div className="flex space-x-4">
                        <img src="/visa.png" alt="Visa" className="h-6" loading="lazy" />
                        <img src="/mastercard.png" alt="MasterCard" className="h-6" loading="lazy" />
                        <img src="/momo.png" alt="Momo" className="h-6" loading="lazy"/>
                    </div>
                </div>
            </div>
        </footer>
    )
}
