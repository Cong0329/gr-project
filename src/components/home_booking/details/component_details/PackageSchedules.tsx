// import { useEffect, useState } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { createAppointment } from "../../../../redux/scheduleSlice";
// import { format, addDays } from "date-fns";
// import { vi } from "date-fns/locale";
// import { useNavigate, useParams } from "react-router-dom";

// const PackageSchedule = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { packageType, packageId } = useParams();

//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [selectedTime, setSelectedTime] = useState(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const { pendingAppointments, loading, error } = useSelector(
//     (state) => state.schedule
//   );
//   const user = useSelector((state) => state.auth?.user);

//   // Get package information based on type and ID
//   const packageData = useSelector((state) => {
//     if (packageType === "general") {
//       return state.generalPackages.packages.find(
//         (pkg) => pkg.id === parseInt(packageId)
//       );
//     } else if (packageType === "medical") {
//       return state.medicalPackages.packages.find(
//         (pkg) => pkg.id === parseInt(packageId)
//       );
//     }
//     return null;
//   });

//   // Generate available dates (next 14 days)
//   const availableDates = [...Array(14)].map((_, index) =>
//     addDays(new Date(), index)
//   );

//   // Available time slots
//   const timeSlots = [
//     "08:00 - 09:00",
//     "09:00 - 10:00",
//     "10:00 - 11:00",
//     "11:00 - 12:00",
//     "13:30 - 14:30",
//     "14:30 - 15:30",
//     "15:30 - 16:30",
//     "16:30 - 17:30",
//   ];

//   // Check if date is weekend
//   const isWeekend = (date) => {
//     const day = date.getDay();
//     return day === 0 || day === 6; // 0 is Sunday, 6 is Saturday
//   };

//   const handleDateSelect = (date) => {
//     setSelectedDate(date);
//     setSelectedTime(null); // Reset time selection when date changes
//   };

//   const handleTimeSelect = (time) => {
//     setSelectedTime(time);
//   };

//   const handleSubmit = () => {
//     if (!selectedDate || !selectedTime || !user) {
//       return;
//     }

//     setIsSubmitting(true);

//     // Parse time string to get start and end times
//     const [startTime, endTime] = selectedTime.split(" - ");

//     const appointmentData = {
//       user_id: user.id,
//       schedule_id: null, // Schedule will be created by doctor later
//       status: "pending",
//       created_at: new Date().toISOString(),
//       start_time: startTime,
//       end_time: endTime,
//       date: format(selectedDate, "yyyy-MM-dd"),
//       type: packageType,
//       package_id: parseInt(packageId),
//     };

//     dispatch(createAppointment(appointmentData))
//       .unwrap()
//       .then(() => {
//         navigate("/appointments");
//       })
//       .catch((err) => {
//         console.error("Failed to create appointment:", err);
//       })
//       .finally(() => {
//         setIsSubmitting(false);
//       });
//   };

//   if (!packageData) {
//     return <p>Không tìm thấy gói khám.</p>;
//   }

//   return (
//     <div className="bg-gray-50 min-h-screen py-8">
//       <div className="container mx-auto px-4">
//         <div className="bg-white rounded-lg shadow-md p-6 max-w-3xl mx-auto">
//           <h1 className="text-2xl font-bold text-blue-600 mb-6">
//             Đặt lịch: {packageData.name}
//           </h1>

//           {/* Package details */}
//           <div className="mb-8 p-4 bg-blue-50 rounded-lg">
//             <h2 className="text-lg font-semibold text-gray-800 mb-2">
//               Thông tin gói khám
//             </h2>
//             <p className="text-gray-700 mb-2">
//               <span className="font-medium">Tên gói:</span> {packageData.name}
//             </p>
//             <p className="text-gray-700 mb-2">
//               <span className="font-medium">Giá:</span>{" "}
//               {packageData.price?.toLocaleString()} VND
//             </p>
//             <p className="text-gray-700">
//               <span className="font-medium">Thời gian:</span>{" "}
//               {packageData.totalDuration || "60"} phút
//             </p>
//           </div>

//           {/* Date selection */}
//           <div className="mb-8">
//             <h2 className="text-lg font-semibold text-gray-800 mb-4">
//               Chọn ngày
//             </h2>
//             <div className="flex gap-2 overflow-x-auto pb-2">
//               {availableDates.map((date, index) => (
//                 <button
//                   key={index}
//                   onClick={() => handleDateSelect(date)}
//                   disabled={isWeekend(date)}
//                   className={`flex-shrink-0 px-4 py-2 rounded-md ${
//                     isWeekend(date)
//                       ? "bg-gray-100 text-gray-400 cursor-not-allowed"
//                       : format(selectedDate, "yyyy-MM-dd") ===
//                         format(date, "yyyy-MM-dd")
//                       ? "bg-blue-500 text-white"
//                       : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
//                   }`}
//                 >
//                   <div className="text-center">
//                     <div className="text-sm">
//                       {format(date, "EEE", { locale: vi })}
//                     </div>
//                     <div className="font-medium">{format(date, "dd/MM")}</div>
//                   </div>
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Time selection */}
//           <div className="mb-8">
//             <h2 className="text-lg font-semibold text-gray-800 mb-4">
//               Chọn giờ
//             </h2>
//             <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
//               {timeSlots.map((time, index) => (
//                 <button
//                   key={index}
//                   onClick={() => handleTimeSelect(time)}
//                   className={`px-3 py-2 rounded-md text-center ${
//                     selectedTime === time
//                       ? "bg-blue-500 text-white"
//                       : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
//                   }`}
//                 >
//                   {time}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Submit button */}
//           <div className="flex justify-end">
//             <button
//               onClick={handleSubmit}
//               disabled={
//                 !selectedDate ||
//                 !selectedTime ||
//                 isSubmitting ||
//                 loading.createAppointment
//               }
//               className={`px-6 py-3 rounded-md ${
//                 !selectedDate ||
//                 !selectedTime ||
//                 isSubmitting ||
//                 loading.createAppointment
//                   ? "bg-gray-300 text-gray-500 cursor-not-allowed"
//                   : "bg-blue-600 text-white hover:bg-blue-700"
//               }`}
//             >
//               {isSubmitting || loading.createAppointment
//                 ? "Đang xử lý..."
//                 : "Xác nhận đặt lịch"}
//             </button>
//           </div>

//           {/* Error message */}
//           {error.createAppointment && (
//             <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
//               {error.createAppointment}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PackageSchedule;
import { useState, useEffect } from "react";
import { format, addDays, isSameDay } from "date-fns";
import { vi } from "date-fns/locale";
import { Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";

const PackageSchedule = ({ packageData, onSubmit }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

  const {
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      date: format(new Date(), "yyyy-MM-dd"),
      time: "",
    },
  });

  // Nếu không có dữ liệu gói được truyền vào, sử dụng dữ liệu mẫu
  const currentPackage = packageData || {
    id: 1,
    name: "Gói xét nghiệm #1",
    price: 1500000,
    totalDuration: "60",
  };

  // Generate available dates (next 14 days)
  const availableDates = [...Array(14)].map((_, index) =>
    addDays(new Date(), index)
  );

  // Available time slots with availability status
  const timeSlots = [
    { time: "08:00 - 09:00", available: true },
    { time: "09:00 - 10:00", available: true },
    { time: "10:00 - 11:00", available: true },
    { time: "11:00 - 12:00", available: false },
    { time: "13:30 - 14:30", available: true },
    { time: "14:30 - 15:30", available: true },
    { time: "15:30 - 16:30", available: true },
    { time: "16:30 - 17:30", available: true },
  ];

  // Check if date is weekend
  const isWeekend = (date) => {
    const day = date.getDay();
    return day === 0 || day === 6; // 0 is Sunday, 6 is Saturday
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setValue("date", format(date, "yyyy-MM-dd"));
    setSelectedTime(null);
    setValue("time", "");
  };

  const handleTimeSelect = (timeSlot) => {
    if (!timeSlot.available) return;
    setSelectedTime(timeSlot.time);
    setValue("time", timeSlot.time);
  };

  const processSubmit = (data) => {
    setIsSubmitting(true);

    // If custom onSubmit is provided, use it
    if (onSubmit) {
      onSubmit({
        packageData: currentPackage,
        date: selectedDate,
        time: selectedTime,
      });
      setIsSubmitting(false);
      return;
    }

    // Default submission behavior
    setTimeout(() => {
      alert(`Đã đặt lịch thành công!
Gói: ${currentPackage.name}
Ngày: ${format(selectedDate, "dd/MM/yyyy")}
Giờ: ${selectedTime}`);

      setIsSubmitting(false);
    }, 1500);
  };

  // Format date for display
  const formatDateForDisplay = (date) => {
    const today = new Date();
    const tomorrow = addDays(today, 1);

    if (isSameDay(date, today)) {
      return "Hôm nay";
    } else if (isSameDay(date, tomorrow)) {
      return "Ngày mai";
    }
    return format(date, "dd/MM/yyyy");
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-blue-600 text-white p-4">
        <h2 className="text-xl font-bold">Đặt lịch khám</h2>
        <p className="text-blue-100">{currentPackage.name}</p>
      </div>

      <form onSubmit={handleSubmit(processSubmit)}>
        <div className="p-6">
          {/* Package Info Card */}
          <div className="flex flex-wrap items-center mb-6 bg-blue-50 rounded-lg p-4">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-600 text-white rounded-full mr-4">
              <Calendar size={24} />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800">
                {currentPackage.name}
              </h3>
              <div className="flex flex-wrap gap-4 text-sm mt-1">
                <span className="text-blue-600 font-medium">
                  {currentPackage.price?.toLocaleString()} VND
                </span>
                <span className="text-gray-500">•</span>
                <span className="text-gray-600">
                  {currentPackage.totalDuration || "60"} phút
                </span>
              </div>
            </div>
          </div>

          {/* Date Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chọn ngày
            </label>
            <div className="relative">
              <input
                type="text"
                readOnly
                value={formatDateForDisplay(selectedDate)}
                onClick={() => setShowCalendar(!showCalendar)}
                className="w-full p-3 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />

              {showCalendar && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="absolute z-10 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 w-full"
                >
                  <div className="p-3 grid grid-cols-4 gap-2">
                    {availableDates.slice(0, 8).map((date, index) => (
                      <button
                        type="button"
                        key={index}
                        onClick={() => {
                          handleDateSelect(date);
                          setShowCalendar(false);
                        }}
                        disabled={isWeekend(date)}
                        className={`p-2 rounded-md text-center ${
                          isWeekend(date)
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : isSameDay(selectedDate, date)
                            ? "bg-blue-600 text-white"
                            : "bg-white hover:bg-blue-50 text-gray-700"
                        }`}
                      >
                        <div className="text-sm">
                          {format(date, "EEE", { locale: vi })}
                        </div>
                        <div className="font-medium">
                          {format(date, "dd/MM")}
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Time Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chọn giờ
            </label>
            <div className="grid grid-cols-4 gap-2">
              {timeSlots.map((slot, index) => (
                <button
                  type="button"
                  key={index}
                  onClick={() => handleTimeSelect(slot)}
                  disabled={!slot.available}
                  className={`p-2 rounded-md text-center border ${
                    !slot.available
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                      : selectedTime === slot.time
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white hover:bg-blue-50 text-gray-700 border-gray-300"
                  }`}
                >
                  {slot.time}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 flex justify-end">
          <button
            type="submit"
            disabled={!selectedDate || !selectedTime || isSubmitting}
            className={`px-6 py-2 rounded-lg text-base font-medium transition-all duration-200 ${
              !selectedDate || !selectedTime || isSubmitting
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg"
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Đang xử lý...
              </span>
            ) : (
              "Xác nhận đặt lịch"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PackageSchedule;
