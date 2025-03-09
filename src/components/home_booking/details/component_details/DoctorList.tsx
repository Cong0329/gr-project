const doctors = [
  {
    id: 1,
    name: "PGS. TS. BSCKII. TTƯT Vũ Văn Hoé",
    experience:
      "Bác sĩ có 35 năm kinh nghiệm về Cột sống, thần kinh, cơ xương khớp",
    position: "Phó chủ tịch hội Phẫu thuật cột sống Việt Nam",
    patientAge: "Bác sĩ nhận khám từ 7 tuổi trở lên",
    location: "Hà Nội",
    clinic: "Phòng khám Spinetech Clinic",
    address: "Tòa nhà GP, 257 Giải Phóng, Phương Mai, Hà Nội",
    price: "500.000đ",
    schedule: [
      "09:00 - 09:30",
      "09:30 - 10:00",
      "10:00 - 10:30",
      "10:30 - 11:00",
      "11:00 - 11:30",
      "11:30 - 12:00",
      "13:30 - 14:00",
      "14:00 - 14:30",
      "14:30 - 15:00",
      "15:00 - 15:30",
      "15:30 - 16:00",
    ],
  },
  {
    id: 2,
    name: "ThS.BS Nguyễn Trần Trung",
    experience:
      "Bác sĩ có nhiều năm kinh nghiệm trong khám và điều trị Cơ xương khớp",
    position: "Phó trưởng khoa Cơ Xương Khớp Bệnh viện E",
    patientAge: "Bác sĩ nhận khám từ 15 tuổi trở lên",
    location: "Hà Nội",
    clinic: "Phòng Khám Đa Khoa MSC Clinic",
    address: "TT 20-21-22 Số 204 Nguyễn Tuân, quận Thanh Xuân, Hà Nội",
    price: "500.000đ",
    schedule: [],
  },
];

const DoctorList = () => {
  return (
    <div className="container-fix-spe mx-auto py-6">
      <div className="mb-4 flex justify-end">
        <select className="border border-gray-300 p-2 rounded-md">
          <option>Toàn quốc</option>
        </select>
      </div>

      <div className="grid gap-6">
        {doctors.map((doctor) => (
          <div
            key={doctor.id}
            className="bg-white shadow-md rounded-lg p-6 flex flex-col md:flex-row gap-4"
          >
            <div className="flex flex-col items-center w-full md:w-1/3">
              <div className="bg-gray-300 w-20 h-20 rounded-full"></div>{" "}
              <a href="#" className="text-blue-500 mt-2">
                Xem thêm
              </a>
            </div>

            <div className="w-full md:w-2/3">
              <div className="flex items-center">
                <span className="bg-yellow-400 text-white text-sm px-2 py-1 rounded-lg mr-2">
                  💛 Yêu thích
                </span>
                <h2 className="text-blue-500 font-bold text-lg">
                  {doctor.name}
                </h2>
              </div>
              <p className="text-gray-700">{doctor.experience}</p>
              <p className="text-gray-500">{doctor.position}</p>
              <p className="text-gray-500">{doctor.patientAge}</p>
              <p className="text-gray-500">📍 {doctor.location}</p>

              <div className="mt-4 bg-gray-100 p-4 rounded-lg">
                <h3 className="text-gray-700 font-semibold">📅 LỊCH KHÁM</h3>
                {doctor.schedule.length > 0 ? (
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {doctor.schedule.map((time, index) => (
                      <span
                        key={index}
                        className="bg-gray-200 text-gray-700 text-sm px-2 py-1 rounded-md text-center"
                      >
                        {time}
                      </span>
                    ))}
                  </div>
                ) : (
                  <button className="bg-blue-500 text-white px-4 py-2 rounded-md mt-2">
                    Đăng ký khám
                  </button>
                )}
              </div>

              <div className="mt-4">
                <p className="font-bold text-gray-800">{doctor.clinic}</p>
                <p className="text-gray-600">{doctor.address}</p>
                <p className="text-gray-800 font-semibold">
                  Giá khám: {doctor.price}{" "}
                  <a href="#" className="text-blue-500">
                    Xem chi tiết
                  </a>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorList;
