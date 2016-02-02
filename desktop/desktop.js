String.prototype.reverse = function() {
  return this.split("").reverse().join("");
};

document.documentElement.addEventListener("click", () =>
  document.documentElement.webkitRequestFullscreen());

var windows = [];
var newWindow = (id, title) => {
  var md = e => {
    offX = e.clientX - parseInt(elem.offsetLeft);
    offY = e.clientY - parseInt(elem.offsetTop);
    window.addEventListener("mousemove", mm, true);
    window.addEventListener("mouseup", mu, true);
  };
  var mu = () => {
    window.removeEventListener("mousemove", mm, true);
  };
  var mm = e => {
    elem.style.left = (e.clientX - offX) + "px";
    elem.style.top = (e.clientY - offY) + "px";
  };
  var offX;
  var offY;
  
  var elem = document.createElement("div");
  elem.classList.add("win");
  elem.classList.add("initial-size");
  elem.innerHTML = `<div class="wintop" title="${title}" id="${id}">
  <div class="icon reload"></div><div class="icon minimize"></div><div class="icon resize"></div><div class="icon close"></div>
</div>`;
  elem.querySelector(".wintop").addEventListener("mousedown", md, false);
  return elem;
};

var login = newWindow("login", "login");
document.body.appendChild(login);