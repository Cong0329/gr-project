import { useParams } from "react-router-dom";
import Breadcrumb from "./component_details/BreadCrumb";

const OnlExDetail = () => {
  const { name } = useParams();

  const dieases = [
    "Gout",
    "Thoái hóa khớp: khớp gối, cột sống thắt lưng, cột sống cổ",
    "Viêm khớp dạng thấp, Viêm đa khớp, Viêm gân",
    "Tràn dịch khớp gối, Tràn dịch khớp háng, Tràn dịch khớp khuỷu, Tràn dịch khớp vai",
    "Loãng xương, đau nhức xương",
    "Viêm xương, gai xương",
    "Viêm cơ, Teo cơ, chứng đau mỏi cơ",
    "Yếu cơ, Loạn dưỡng cơ",
    "Các chấn thương về cơ, xương, khớp",
  ];

  return (
    <>
      <div id="onlex-detail" className="min-h-screen bg-gray-50">
        <div className="container-fix-spe mx-auto px-4 sm:px-10">
          <Breadcrumb/>

          <div className="bg-gradient-to-r from-blue-100 to-blue-50 rounded-2xl py-12 text-center px-6 transition-all duration-300">
            <div className="mt-6 flex justify-center">
              <div className="relative w-full max-w-md">
                <h1 className="text-3xl font-bold" style={{ color: "#284a75" }}>
                  {decodeURIComponent(name || "Chuyên khoa")}
                </h1>
              </div>
            </div>
          </div>
        </div>
        <div className="container-fix-spe mx-auto px-4 py-12 sm:px-10">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-8 border-b border-gray-200">
              <div className="flex items-center mb-6">
                <div className="bg-blue-100 p-3 rounded-lg mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Bác sĩ {decodeURIComponent(name || "Chuyên khoa")} giỏi
                </h2>
              </div>

              <p className="text-gray-600 mb-6">
                Danh sách các bác sĩ uy tín đầu ngành{" "}
                {decodeURIComponent(name || "Chuyên khoa")} tại Việt Nam
              </p>

              <ul className="space-y-4">
                {[
                  "Các chuyên gia có quá trình đào tạo bài bản, nhiều kinh nghiệm",
                  "Các giáo sư, phó giáo sư đang trực tiếp nghiên cứu và giảng dạy tại Đại học Y khoa Hà Nội",
                  `Các bác sĩ đã, đang công tác tại các bệnh viện hàng đầu Khoa ${decodeURIComponent(
                    name || "Chuyên khoa"
                  )} - Bệnh viện Bạch Mai, Bệnh viện Hữu nghị Việt Đức, Bệnh Viện E`,
                  `Là thành viên hoặc lãnh đạo các tổ chức chuyên môn như: Hiệp hội ${decodeURIComponent(
                    name || "Chuyên khoa"
                  )}`,
                  "Được nhà nước công nhận các danh hiệu Thầy thuốc Nhân dân, Thầy thuốc Ưu tú, Bác sĩ Cao cấp",
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                      {index + 1}
                    </span>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-8">
              <div className="flex items-center mb-6">
                <div className="bg-red-100 p-3 rounded-lg mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-red-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Bệnh {decodeURIComponent(name || "Chuyên khoa")}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dieases.map((disease, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 hover:bg-blue-50 rounded-lg p-4 transition-colors duration-300 border border-gray-200"
                  >
                    <div className="flex items-center">
                      <span className="text-gray-800 font-medium">
                        {disease}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OnlExDetail;
