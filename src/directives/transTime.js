const transTime = (time) => {
  if (!time) return '未处理';
  const date = new Date(time);
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // 月份是从0开始的，所以需要+1
  const day = date.getDate();
  const hours = date.getHours() >= 10 ? date.getHours() : `0${date.getHours()}`;
  const minutes =
    date.getMinutes() >= 10 ? date.getMinutes() : `0${date.getMinutes()}`;
  const seconds =
    date.getSeconds() >= 10 ? date.getSeconds() : `0${date.getSeconds()}`;
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

export default {
  bind(el, binding) {
    el.innerText = transTime(binding.value);
  }
};
