import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export const formatMessageCreatedDate = (date: Date | string | number) => {
  const targetDate = dayjs(date);
  const now = dayjs();
  
  const diffDay = now.diff(targetDate, 'day');

  if (diffDay < 7) {
    return targetDate.fromNow();
  }

  return targetDate.format('D MMMM YYYY HH:mm');
};