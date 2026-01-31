export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// for <input type="date">
export function toDateInputValue(dateString: string): string {
  return new Date(dateString).toISOString().slice(0, 10);
}

export function calcDaysDifference(
  targetDate: Date,
  anchorDate = new Date(),
): number {
  anchorDate.setHours(0, 0, 0, 0);
  targetDate.setHours(0, 0, 0, 0);
  // Calculate the difference in milliseconds
  const timeDifference: number = targetDate.getTime() - anchorDate.getTime();
  // Convert milliseconds to days (1000ms * 60s * 60m * 24h = 86400000ms per day).
  const daysDifference: number = timeDifference / (1000 * 60 * 60 * 24);
  return Math.round(daysDifference);
}
