export function formatTimestamp(ts) {
  const inputDate = new Date(ts);
  const now = new Date();

  const year = inputDate.getFullYear();
  const month = inputDate.getMonth();
  const date = inputDate.getDate();
  // 判断是否是今天
  const isToday = year === now.getFullYear() && month === now.getMonth() && date === now.getDate();

  if (isToday) {
    return inputDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else {
    return `${padZero(month + 1)}/${padZero(date)}`;
  }
}
function padZero(n) {
  return n < 10 ? '0' + n : n;
}
