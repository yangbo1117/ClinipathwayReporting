import fsIcon from "assets/img/fullscreen.svg";
import startImg from "assets/img/start.png";

let color = [
  "#40ADF4",
  "#24CB8C",
  "#ff6479",
  "#FBC02D",
  "#9B7CFC",
  "#FF8A80",
  "#00BCD4",
  "#F8A13F",
  "#40ADF4",
  "#24CB8C",
  "#ff6479",
  "#FBC02D",
  "#9B7CFC",
  "#FF8A80",
  "#00BCD4",
  "#F8A13F",
];

function RenderFullScreen(id) {
  const element = document.getElementById(id);
  if (element.requestFullScreen) { // HTML W3C 提议
      element.requestFullScreen();
  } else if (element.msRequestFullscreen) { // IE11
      element.msRequestFullScreen();
  } else if (element.webkitRequestFullScreen) { // Webkit (works in Safari5.1 and Chrome 15)
      element.webkitRequestFullScreen();
  } else if (element.mozRequestFullScreen) { // Firefox (works in nightly)
      element.mozRequestFullScreen();
  }
  // 退出全屏
  if (element.requestFullScreen) {
      document.exitFullscreen();
  } else if (element.msRequestFullScreen) {
      document.msExitFullscreen();
  } else if (element.webkitRequestFullScreen) {
      document.webkitCancelFullScreen();
  } else if (element.mozRequestFullScreen) {
      document.mozCancelFullScreen();
  }
}

function getLinebreakFormat(numbers, rowNum, addNum, shakeLabel?) {
  return function(param) {
    if (!param) return param;
    let params = param;
    if (shakeLabel) params = shakeLabel(param);
    var newParamsName = '';
    var paramsNameNumber = params.length;
    var provideNumber = numbers ? numbers : 10;
    var rowNumber = Math.ceil(paramsNameNumber / provideNumber);
    var row = rowNum ? rowNum : 3;
    var add = addNum ? addNum : 3;
    if (paramsNameNumber > provideNumber) {
      for (var p = 0; p < rowNumber; p++) {
        var tempStr = '';
        var start = p * provideNumber;
        var end = start + provideNumber;
        if (p === rowNumber - 1) {
          tempStr = params.substring(start, paramsNameNumber);
        } else {
          tempStr = params.substring(start, end) + '\n';
        }
        newParamsName += tempStr;
      }
      if (rowNumber > row) {
        newParamsName =
          newParamsName.slice(0, provideNumber * (row - 1) + add) + '...';
      }
    } else {
      newParamsName = params;
    }
    return newParamsName;
  };
}

export { color, getLinebreakFormat, RenderFullScreen, fsIcon, startImg };