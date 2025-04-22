import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";

const ContestCountdown = ({ targetDate, onComplete, label = "Starts In" }) => {
  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    if (!targetDate) return;

    const calculateTimeRemaining = () => {
      const now = new Date();
      const target = new Date(targetDate);
      const difference = target - now;

      if (difference <= 0) {
        // Target date has passed
        setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        if (onComplete) onComplete();
        return;
      }

      // Calculate time components
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeRemaining({ days, hours, minutes, seconds });
    };

    // Calculate immediately and then set interval
    calculateTimeRemaining();
    const timer = setInterval(calculateTimeRemaining, 1000);

    return () => clearInterval(timer);
  }, [targetDate, onComplete]);

  const formatTimeValue = (value) => {
    return value < 10 ? `0${value}` : value;
  };

  return (
    <div className="flex flex-col items-end">
      <span className="text-sm text-muted-foreground mb-1">{label}</span>
      <div className="flex space-x-2">
        {timeRemaining.days > 0 && (
          <Card className="px-3 py-1">
            <span className="font-mono font-medium">
              {formatTimeValue(timeRemaining.days)}d
            </span>
          </Card>
        )}
        <Card className="px-3 py-1">
          <span className="font-mono font-medium">
            {formatTimeValue(timeRemaining.hours)}h
          </span>
        </Card>
        <Card className="px-3 py-1">
          <span className="font-mono font-medium">
            {formatTimeValue(timeRemaining.minutes)}m
          </span>
        </Card>
        <Card className="px-3 py-1">
          <span className="font-mono font-medium">
            {formatTimeValue(timeRemaining.seconds)}s
          </span>
        </Card>
      </div>
    </div>
  );
};

export default ContestCountdown;
