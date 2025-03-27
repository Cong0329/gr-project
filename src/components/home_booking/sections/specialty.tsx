import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import "./Specialty.css";
import CoXuongKhop from "../../../assets/sections/Co_Xuong_Khop.webp";
import { Link } from "react-router-dom";

const Specialty = () => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3, slidesToScroll: 3 } },
      { breakpoint: 600, settings: { slidesToShow: 2, slidesToScroll: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1 } },
    ],
  };

  const specialties = [
    { image: CoXuongKhop, name: "Cơ Xương Khớp" },
    { image: CoXuongKhop, name: "Thần Kinh" },
    { image: CoXuongKhop, name: "Tiêu Hoá" },
    { image: CoXuongKhop, name: "Tim Mạch" },
    { image: CoXuongKhop, name: "Tai Mũi Họng" },
    { image: CoXuongKhop, name: "Cột Sống" },
    { image: CoXuongKhop, name: "Y Học Cổ Truyền" },
    { image: CoXuongKhop, name: "Sản Phụ Khoa" },
    { image: CoXuongKhop, name: "Siêu Âm Thai" },
    { image: CoXuongKhop, name: "Nhi Khoa" },
    { image: CoXuongKhop, name: "Da Liễu" },
  ];

  return (
    <div id="specialty-section" className="full-home w-full overflow-hidden">
      <div className="home-specialty container-fix-spe mx-auto">
        <div className="home-content">
          <div className="home-title relative flex justify-between items-center mb-4 md:px-20">
            <h3 className="text-xl font-bold">Chuyên khoa phổ biến</h3>
            <Link
              to="/booking-home/specialty-list"
              className="absolute right-20"
            >
              <button className="text-[rgb(45,135,243)] font-semibold">
                Xem thêm<span className="ml-1">&gt;</span>
              </button>
            </Link>
          </div>

          <div className="home-body pt-5">
            <Slider {...settings}>
              {specialties.map((specialty, index) => (
                <div key={index} className="px-2">
                  <Link
                    to={`/booking-home/specialty-detail/${encodeURIComponent(
                      specialty.name
                    )}`}
                  >
                    <div className="flex flex-col justify-center items-center">
                      <div className="w-full h-48 bg-white flex flex-col items-center justify-center rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                        <img
                          src={specialty.image}
                          className="w-24 h-24 rounded-full object-cover mb-2"
                          alt={specialty.name}
                          loading="lazy"
                        />
                        <div className="text-base font-semibold">
                          {specialty.name}
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Specialty;
