export const getFormattedDate = (
  startDate: Date,
  endDate: Date,
  rentalType: string,
): string => {
  if (rentalType === 'hourly') {
    // Format for hourly rental
    const startTime = startDate.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
    const endTime = endDate.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
    return `${startDate.getDate()}/${
      startDate.getMonth() + 1
    } from ${startTime} to ${endTime}`;
  } else if (rentalType === 'daily') {
    // Format for daily rental
    return `${startDate.getDate()}/${startDate.getMonth() + 1}`;
  } else if (rentalType === 'monthly') {
    // Format for monthly rental
    return '';
  }

  // Default case
  return '';
};
