export const resObj = (statusCode: number, message: string, data?: any) => {
  return {
    statusCode,
    message,
    data: data || null,
  };
};

export const isDurationValid = (start: string, end: string) => {
  if (start.length !== 5 || end.length !== 5) return false;

  const startTimeNumbers = [Number(start.slice(0, 2)), Number(start.slice(3))];
  const endTimeNumbers = [Number(end.slice(0, 2)), Number(end.slice(3))];
  if (
    startTimeNumbers[0] < 0 ||
    startTimeNumbers[0] > 23 ||
    startTimeNumbers[1] < 0 ||
    startTimeNumbers[1] > 59 ||
    endTimeNumbers[0] < 0 ||
    endTimeNumbers[0] > 23 ||
    endTimeNumbers[0] < 0 ||
    endTimeNumbers[1] > 59
  )
    return false;
  if (start < '07:00' || end > '23:00') return false;
  if (start > end) return false;
  return true;
};
