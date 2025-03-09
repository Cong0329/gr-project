import { useState, useEffect } from "react";

const CountdownTimer: React.FC = () => {
  const targetTime = new Date().getTime() + 16 * 60 * 60 * 1000; // Đếm ngược 16 giờ

  const calculateTimeLeft = (): { hours: number; minutes: number; seconds: number; isOver: boolean } => {
    const now = new Date().getTime();
    const difference = targetTime - now;

    if (difference <= 0) return { hours: 0, minutes: 0, seconds: 0, isOver: true };

    return {
      hours: Math.floor(difference / (1000 * 60 * 60)),
      minutes: Math.floor((difference / (1000 * 60)) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      isOver: false,
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className=" text-white font-bold text-lg p-3 flex w-[250px] ">
      {timeLeft.isOver ? (
        <span className="text-red-400">Đã kết thúc!</span>
      ) : (
        <span>
          Kết thúc sau:{" "}
          <span className="text-yellow-300">
            {String(timeLeft.hours).padStart(2, "0")}:
            {String(timeLeft.minutes).padStart(2, "0")}:
            {String(timeLeft.seconds).padStart(2, "0")}
          </span>
        </span>
      )}
    </div>
  );
};

export default CountdownTimer;
