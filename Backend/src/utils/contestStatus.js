/**
 * Utility functions for handling contest status updates
 */

/**
 * Check if a contest has ended based on its date, time and duration
 * @param {Object} contest - The contest object with date, time and duration properties
 * @returns {Boolean} - True if the contest has ended, false otherwise
 */
export const hasContestEnded = (contest) => {
  const now = new Date();

  // Parse contest date and time
  const contestDate = new Date(contest.date);

  // Parse the time string (assuming format like "2:30 PM")
  const timeParts = contest.time.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!timeParts) return false;

  let hours = parseInt(timeParts[1]);
  const minutes = parseInt(timeParts[2]);
  const period = timeParts[3].toUpperCase();

  // Convert to 24-hour format
  if (period === "PM" && hours < 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;

  // Set the hours and minutes on contest date
  contestDate.setHours(hours, minutes, 0, 0);

  // Calculate end time by adding duration in minutes
  const durationInMs = parseInt(contest.duration) * 60 * 1000;
  const endTime = new Date(contestDate.getTime() + durationInMs);

  // Compare with current time
  return now > endTime;
};

/**
 * Update the status of contests based on current time
 * @param {Array} contests - Array of contest objects
 * @returns {Array} - Array of contests with potentially updated status
 */
export const updateContestsStatus = (contests) => {
  return contests.map((contest) => {
    // If contest is upcoming and has ended, mark it as completed
    if (contest.status === "upcoming" && hasContestEnded(contest)) {
      contest.status = "completed";
    }
    return contest;
  });
};
