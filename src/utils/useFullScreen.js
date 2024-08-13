export function toggleFullscreen() {
  isFullscreen() ? exit() : enter(document.documentElement);
}

export function isFullscreen() {
  return (
    !!document.fullscreenElement ||
    !!document.webkitFullscreenElement ||
    !!document.mozFullScreenElement ||
    !!document.msFullscreenElement ||
    null
  );
}

function enter(element) {
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.webkitRequestFullscreen) {
    // Safari
    element.webkitRequestFullscreen();
  } else if (element.mozRequestFullScreen) {
    // Firefox
    element.mozRequestFullScreen();
  } else if (element.msRequestFullscreen) {
    // IE/Edge
    element.msRequestFullscreen();
  }
}

function exit() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) {
    // Safari
    document.webkitExitFullscreen();
  } else if (document.mozCancelFullScreen) {
    // Firefox
    document.mozCancelFullScreen();
  } else if (document.msExitFullscreen) {
    // IE/Edge
    document.msExitFullscreen();
  }
}
