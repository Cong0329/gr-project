import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchSchedule } from "../../../../redux/scheduleThunks";

const ScheduleList = () => {
  const dispatch = useDispatch();
  const { schedules, loading, error } = useSelector((state) => state.schedule);

  useEffect(() => {
    dispatch(fetchSchedule());
  }, [dispatch]);

  if (loading) return <p>Đang tải lịch khám...</p>;
  if (error) return <p>Lỗi: {error}</p>;

  return (
    <div className="schedule-list">
      <h2 className="text-xl font-bold">Lịch Khám</h2>
      {Array.isArray(schedules) && schedules.length > 0 ? (
        <ul className="mt-4">
          {schedules.map((schedule, index) => (
            <li key={index} className="p-3 border-b">
              <span className="font-bold">{schedule.time}</span> -{" "}
              {schedule.doctor}
            </li>
          ))}
        </ul>
      ) : (
        <p>Không có lịch khám nào.</p>
      )}
    </div>
  );
};

export default ScheduleList;
