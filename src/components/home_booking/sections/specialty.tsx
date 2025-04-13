import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchDepartments } from "../../../redux/departmentSlice";
import { fetchDoctors } from "../../../redux/doctorSlice";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import "./Specialty.css";

const Specialty = () => {
  const [specialties, setSpecialties] = useState([]);
  const dispatch = useDispatch();

  const { departments, loading: departmentLoading } = useSelector(
    (state) => state.departments
  );
  const { doctors, loading: doctorLoading } = useSelector(
    (state) => state.doctors
  );

  useEffect(() => {
    if (departments.length === 0) dispatch(fetchDepartments());
    if (doctors.length === 0) dispatch(fetchDoctors());
  }, [dispatch, departments.length, doctors.length]);

  useEffect(() => {
    if (doctorLoading || departmentLoading) return;

    const specialtyDoctors = doctors.filter(
      (doctor) => doctor.type === "specialty"
    );

    const specialtyDepartmentIds = [
      ...new Set(specialtyDoctors.map((doc) => Number(doc.department_id))),
    ];

    const filteredDepartments = departments.filter((dept) =>
      specialtyDepartmentIds.includes(dept.id)
    );

    setSpecialties(filteredDepartments);
  }, [departments, doctors, doctorLoading, departmentLoading]);

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

  return (
    <div id="specialty-section" className="full-home w-full overflow-hidden ">
      <div className="home-specialty container-fix-spe lg:px-8 mx-auto">
        <div className="home-content">
          <div className="home-title relative flex justify-between items-center mb-6 lg:px-20 ml:px-0">
            <div className="flex flex-col">
              <h2 className="text-xl lg:text-2xl font-bold text-indigo-600 mb-2">
                Chuyên khoa phổ biến
              </h2>
              <div className="h-1 w-20 bg-indigo-500 rounded"></div>
              <p className="text-gray-600 mt-2 text-sm">
                Tìm kiếm bác sĩ theo chuyên khoa phù hợp với nhu cầu của bạn
              </p>
            </div>
            <Link
              to="/booking-home/specialty-list"
              className="absolute right-20 lg:top-[50%] ml:top-[15%] transform -translate-y-1/2 md:translate-y-0"
            >
              <button className="bg-indigo-100 hover:bg-indigo-200 text-indigo-500 font-semibold py-2 px-4 rounded-full transition duration-300 flex items-center">
                Xem thêm<span className="ml-1">&gt;</span>
              </button>
            </Link>
          </div>

          <div className="home-body pt-5">
            <Slider {...settings}>
              {doctorLoading || departmentLoading ? (
                <p className="text-center">Đang tải chuyên khoa...</p>
              ) : specialties.length > 0 ? (
                specialties.map((specialty) => (
                  <div key={specialty.id} className="px-2">
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
                          <div className="text-xs text-gray-500 mt-2 text-center">
                            {
                              doctors.filter(
                                (doc) =>
                                  Number(doc.department_id) === specialty.id
                              ).length
                            }{" "}
                            bác sĩ
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))
              ) : (
                <p className="text-center">Không có dữ liệu chuyên khoa.</p>
              )}
            </Slider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Specialty;
