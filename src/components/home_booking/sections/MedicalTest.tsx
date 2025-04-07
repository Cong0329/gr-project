import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMedicalTests } from "../../../redux/medicalTestSlice";
import "./MedicalTest.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import img from "../../../assets/logo.png";
import { Link } from "react-router-dom";

const MedicalTest = () => {
  const dispatch = useDispatch();
  const { tests, loading, error } = useSelector((state) => state.medicalTests);

  useEffect(() => {
    dispatch(fetchMedicalTests());
  }, [dispatch]);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const getPopularTests = () => {
    return tests.slice(0, 8);
  };

  const getRecentTests = () => {
    return [...tests].reverse().slice(0, 4);
  };

  const getMostValuableTests = () => {
    return [...tests]
      .sort((a, b) => Number(b.price) - Number(a.price))
      .slice(0, 4);
  };

  if (loading) {
    return <div className="text-center py-8">Đang tải dữ liệu...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Lỗi: {error}</div>;
  }

  return (
    <div id="medical-test-section" className="medical-test w-full">
      <div className="container-lite mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-6 medical-title">
            <div className="flex flex-col">
              <h2 className="text-xl lg:text-2xl font-bold text-indigo-500 mb-2">
                Xét nghiệm y học
              </h2>
              <div className="h-1 w-20 bg-indigo-400 rounded"></div>
            </div>
            <Link to="/booking-home/medicaltest-list">
              <button className="bg-indigo-100 hover:bg-indigo-200 text-indigo-500 font-semibold py-2 px-4 rounded-full transition duration-300 flex items-center">
                Xem thêm
                <span className="ml-1">&gt;</span>
              </button>
            </Link>
          </div>

          <div className="mb-8">
            {tests.length > 0 ? (
              <Slider {...settings}>
                {getPopularTests().map((test) => (
                  <div key={test.id} className="px-2">
                    <Link
                      to={`/booking-home/medicaltest-detail/${encodeURIComponent(
                        test.name
                      )}`}
                      className="block h-full"
                    >
                      <div className="flex flex-col justify-center items-center">
                        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-md">
                          <img
                            src={test.image || img}
                            alt={test.name}
                            className="w-16 h-16 object-contain"
                          />
                        </div>
                        <div className="text-center mt-2">
                          <div className="text-sm font-semibold">
                            {test.name}
                          </div>
                          {test.price && (
                            <div className="text-xs text-gray-600">
                              {Number(test.price).toLocaleString("vi-VN")} VNĐ
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </Slider>
            ) : (
              <div className="w-full text-center py-8">
                Không có xét nghiệm nào hiển thị
              </div>
            )}
          </div>

          <div className="bg-blue-50 p-6 rounded-lg mb-8">
            <h4 className="text-lg font-semibold mb-3 text-blue-700">
              Thông tin xét nghiệm
            </h4>
            <p className="mb-3 text-gray-700">
              Xét nghiệm y học giúp chẩn đoán, theo dõi và điều trị các bệnh lý
              khác nhau. Kết quả xét nghiệm giúp bác sĩ đánh giá tình trạng sức
              khỏe của bạn chính xác hơn.
            </p>
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div className="flex items-start">
                <div className="mr-3 text-blue-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h5 className="font-medium">Kết quả nhanh chóng</h5>
                  <p className="text-sm text-gray-600">
                    Nhận kết quả trong thời gian ngắn nhất
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="mr-3 text-blue-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h5 className="font-medium">Đội ngũ chuyên môn cao</h5>
                  <p className="text-sm text-gray-600">
                    Được thực hiện bởi các chuyên gia y tế
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="mr-3 text-blue-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h5 className="font-medium">Thiết bị hiện đại</h5>
                  <p className="text-sm text-gray-600">
                    Sử dụng công nghệ mới nhất trong lĩnh vực y tế
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="mr-3 text-blue-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h5 className="font-medium">Môi trường an toàn</h5>
                  <p className="text-sm text-gray-600">
                    Đảm bảo tiêu chuẩn y tế và an toàn cho bệnh nhân
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold mb-4">Xét nghiệm mới nhất</h3>
              <div className="space-y-4">
                {getRecentTests().map((test) => (
                  <Link
                    key={test.id}
                    to={`/booking-home/medicaltest-detail/${encodeURIComponent(
                      test.name
                    )}`}
                    className="flex items-center p-3 border rounded-lg hover:bg-blue-50"
                  >
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mr-4">
                      <img
                        src={test.image || img}
                        alt={test.name}
                        className="w-8 h-8 object-contain"
                      />
                    </div>
                    <div>
                      <div className="font-medium">{test.name}</div>
                      {test.price && (
                        <div className="text-xs text-gray-600">
                          {Number(test.price).toLocaleString("vi-VN")} VNĐ
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold mb-4">
                Gói xét nghiệm chuyên sâu
              </h3>
              <div className="space-y-4">
                {getMostValuableTests().map((test) => (
                  <Link
                    key={test.id}
                    to={`/booking-home/medicaltest-detail/${encodeURIComponent(
                      test.name
                    )}`}
                    className="flex items-center p-3 border rounded-lg hover:bg-blue-50"
                  >
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mr-4">
                      <img
                        src={test.image || img}
                        alt={test.name}
                        className="w-8 h-8 object-contain"
                      />
                    </div>
                    <div>
                      <div className="font-medium">{test.name}</div>
                      {test.price && (
                        <div className="text-xs text-gray-600">
                          {Number(test.price).toLocaleString("vi-VN")} VNĐ
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalTest;
