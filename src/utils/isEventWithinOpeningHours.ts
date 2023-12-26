export function isEventWithinOpeningHours(events, openingHours) {
  return events.every((event) => {
    const eventStart = new Date(event.start);
    const eventEnd = new Date(event.end);
    const eventStartTime = parseInt(
      eventStart
        .toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
        })
        .replace(/:/g, ''),
      10,
    );
    const eventEndTime = parseInt(
      eventEnd
        .toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
        })
        .replace(/:/g, ''),
      10,
    );

    return openingHours.some((oh) => {
      const isOpenDayMatch = oh.open.day === eventStart.getDay();
      const isWithinOpeningHours =
        parseInt(oh.open.time, 10) <= eventStartTime &&
        parseInt(oh.close.time, 10) >= eventEndTime;

      return isOpenDayMatch && isWithinOpeningHours;
    });
  });
}
