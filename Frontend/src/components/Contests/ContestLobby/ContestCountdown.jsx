import React, { useState, useEffect } from "react";

const ContestCountdown = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const difference = new Date(targetDate) - new Date();

    if (difference <= 0) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        total: 0,
      };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      total: difference,
    };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      const timeLeft = calculateTimeLeft();
      setTimeLeft(timeLeft);

      // Clear interval when countdown reaches zero
      if (timeLeft.total <= 0) {
        clearInterval(timer);

        // Reload the page to update contest status
        window.location.reload();
      }
    }, 1000);

    // Cleanup interval on unmount
    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="flex items-center justify-center text-center p-4">
      <div className="grid grid-flow-col gap-5 text-center auto-cols-max">
        {timeLeft.days > 0 && (
          <div className="flex flex-col">
            <span className="countdown font-mono text-4xl">
              <span style={{ "--value": timeLeft.days }}>{timeLeft.days}</span>
            </span>
            days
          </div>
        )}
        <div className="flex flex-col">
          <span className="countdown font-mono text-4xl">
            <span style={{ "--value": timeLeft.hours }}>
              {String(timeLeft.hours).padStart(2, "0")}
            </span>
          </span>
          hours
        </div>
        <div className="flex flex-col">
          <span className="countdown font-mono text-4xl">
            <span style={{ "--value": timeLeft.minutes }}>
              {String(timeLeft.minutes).padStart(2, "0")}
            </span>
          </span>
          min
        </div>
        <div className="flex flex-col">
          <span className="countdown font-mono text-4xl">
            <span style={{ "--value": timeLeft.seconds }}>
              {String(timeLeft.seconds).padStart(2, "0")}
            </span>
          </span>
          sec
        </div>
      </div>
    </div>
  );
};

export default ContestCountdown;
