import { useParams } from "react-router-dom";
import Breadcrumb from "./component_details/BreadCrumb";

const SpecialtyDetail = () => {
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
      <div id="specialty-detail" className="w-full">
        <div className="specialty container-fix-spe mx-auto px-16">
          <Breadcrumb current={decodeURIComponent(name || "Chuyên khoa")} />
        </div>
        <div className="bg-blue-100 py-10 text-center">
          <h1 className="text-3xl font-bold" style={{ color: "#284a75" }}>
            {decodeURIComponent(name || "Chuyên khoa")}
          </h1>
        </div>
      </div>
      <div className="specialty container-fix-spe mx-auto">
        <div className="specialty-content">
          <div className="px-16 py-10">
            <span className="text-lg font-bold w-full block">
              Bác sĩ {decodeURIComponent(name || "Chuyên khoa")} giỏi
            </span>
            <span className="text-base w-full block py-2">
              Danh sách các bác sĩ uy tín đầu ngành{" "}
              {decodeURIComponent(name || "Chuyên khoa")} tại Việt Nam
            </span>
            <ul className="list-disc ml-5 pl-5 py-2">
              <li>
                Các chuyên gia có quá trình đào tạo bài bản, nhiều kinh nghiệm
              </li>
              <li>
                Các giáo sư, phó giáo sư đang trực tiếp nghiên cứu và giảng dạy
                tại Đại học Y khoa Hà Nội
              </li>
              <li>
                Các bác sĩ đã, đang công tác tại các bệnh viện hàng đầu Khoa Cơ
                Xương Khớp - Bệnh viện Bạch Mai, Bệnh viện Hữu nghị Việt
                Đức,Bệnh Viện E.
              </li>
              <li>
                Là thành viên hoặc lãnh đạo các tổ chức chuyên môn như: Hiệp hội
                Cơ Xương Khớp, Hội Thấp khớp học,...
              </li>
              <li>
                Được nhà nước công nhận các danh hiệu Thầy thuốc Nhân dân, Thầy
                thuốc Ưu tú, Bác sĩ Cao cấp,...
              </li>
            </ul>
            <span className="text-lg font-bold w-full block">
              Bệnh {decodeURIComponent(name || "Chuyên khoa")}
            </span>
            <ul className="list-disc ml-5 pl-5 py-2">
              {dieases.map((disease, index) => (
                <li key={index}>{disease}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default SpecialtyDetail;
