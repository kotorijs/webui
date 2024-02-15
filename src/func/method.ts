export const BTC = 'bc1qe0kn3hkqls54rfrjkj5ezcyvtk8suxcy0lfz3r';

export const packageList = [
  'axios',
  'codemirror',
  'vue-codemirror',
  'vue-router',
  'vue-particles',
  'screenfull',
  '@codemirror/lang-javascript',
  '@codemirror/lang-json',
  '@codemirror/theme-one-dark',
  'pinia-plugin-persistedstate',
  'js-base64'
];

export function timestampToTime(timestamp: number) {
  const date = new Date(timestamp * 1000);
  const Y = date.getFullYear() + '-';
  const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  const D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
  const h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
  const m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
  const s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
  return Y + M + D + h + m + s;
}

export function viewState(num: number, lastnum: number, viewcontent?: string | number): string {
  viewcontent = viewcontent ?? num;
  if (num > lastnum) return `<span style="color:lightgreen">↑${viewcontent}</span>`;
  if (num < lastnum) return `<span style="color:red">↓${viewcontent}</span>`;
  return `<span style="color:purple">${viewcontent}</span>`;
}
