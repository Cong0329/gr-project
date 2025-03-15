import Breadcrumb from "./component_details/BreadCrumb";
import { Search } from "lucide-react";
import CoXuongKhop from "../../../assets/sections/Co_Xuong_Khop.webp";
import { useNavigate } from "react-router-dom";

const MedicalTestListPage = () => {
  const categories = [
    { name: "Tổng quát", image: CoXuongKhop },
    { name: "Ung thư", image: CoXuongKhop },
    { name: "NIPT", image: CoXuongKhop },
    { name: "Sốt xuất huyết", image: CoXuongKhop },
    { name: "Dị ứng", image: CoXuongKhop },
    { name: "Gan", image: CoXuongKhop },
  ];

  const navigate = useNavigate();

  return (
    <>
      <div id="medicaltest-detail" className="w-full">
        <div className="medicaltest container-fix-spe mx-auto px-16">
          <Breadcrumb />
        </div>
        <div className="bg-blue-100 py-10 text-center">
          <h1 className="text-3xl font-bold" style={{ color: "#284a75" }}>
            Bạn đang tìm kiếm gì?
          </h1>
          <div className="mt-4 flex justify-center">
            <div className="relative w-2/3">
              <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Tìm kiếm chuyên mục"
                className="w-full py-2 pl-10 pr-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
        <div className="medicaltest container-fix-spe mx-auto">
          <div className="medicaltest-content">
            <div className="p-6 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 py-10">
              {categories.map((category, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition cursor-pointer py-6"
                  onClick={() =>
                    navigate(
                      `/booking-home/medicaltest-detail/${encodeURIComponent(
                        category.name
                      )}`
                    )
                  }
                >
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-12 h-12 mb-2"
                  />
                  <p className="text-gray-700 text-sm font-medium text-center">
                    {category.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MedicalTestListPage;
