// utils.js
export function formatDrivingTime(startTime, endTime) {
    const start = new Date(startTime);
    const end = new Date(endTime);
  
    const timeDifference = end - start;
  
    const hours = Math.floor(timeDifference / (1000 * 60 * 60));
    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
  
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
}
export function formatCustomDate(date, divider = '-') {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}${divider}${month}${divider}${day}`;
}