/**
 * `timetracker` is a simple time tracking library that helps you track the time spent on a task.
 * @author Zack Dawood
 * @date 14-Dec-2024
 * @version 1.1
 */

/**
 * Formats the duration from milliseconds into hours, minutes, and seconds.
 * @param {number} durationInMilliseconds - The duration in milliseconds.
 * @returns {Object} An object containing hours, minutes, and seconds.
 */
function formatDuration(durationInMilliseconds) {
    const hours = Math.floor(durationInMilliseconds / 3600000); // 1000 * 60 * 60
    const minutes = Math.floor((durationInMilliseconds % 3600000) / 60000); // 1000 * 60
    const seconds = Math.floor((durationInMilliseconds % 60000) / 1000); // 1000
    return { hours, minutes, seconds };
  }
  
  /**
   * Logs the time spent on a task.
   * @param {number} durationInMilliseconds - The duration in milliseconds.
   * @param {string} label - A label describing the task.
   * @returns {Object} An object containing hours, minutes, and seconds.
   */
  function logTimeSpent(durationInMilliseconds, label) {
    const { hours, minutes, seconds } = formatDuration(durationInMilliseconds);
    console.log(`Duration: ${hours}h ${minutes}m ${seconds}s on ${label}`);
    return { hours, minutes, seconds };
  }
  
  /**
   * Starts a timer for a specific task.
   * @param {string} label - A label describing the task.
   * @returns {number} The start time in milliseconds.
   */
  function startTimer(label) {
    console.info(`Starting timer for "${label}"...`);
    return Date.now(); // Use Date.now() for better performance than `new Date()`
  }
  
  /**
   * Stops a timer and logs the time spent.
   * @param {number} startTime - The start time in milliseconds.
   * @param {string} label - A label describing the task.
   * @returns {Object} An object containing hours, minutes, and seconds.
   */
  function stopTimer(startTime, label) {
    if (typeof startTime !== "number") {
      throw new Error("Invalid start time. Ensure you call startTimer() first.");
    }
  
    const endTime = Date.now();
    const durationInMilliseconds = endTime - startTime;
    return logTimeSpent(durationInMilliseconds, label);
  }
  
  module.exports = {
    startTimer,
    stopTimer,
  };
  