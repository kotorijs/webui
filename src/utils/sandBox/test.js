// 改进前
function fn1() {
  if (撞墙) {
    if (有血);
    if (无血);
  } else {
    if (有玩家);
    if (无玩家);
  }
}

// 改进后

function fn2() {
  if (没撞墙) {
    if (有玩家);
    if (无玩家);
    return;
  }
  if (有血) return;
  // 执行无血
}

function