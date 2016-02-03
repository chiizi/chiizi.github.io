var $ = q => document.querySelector(q);
var $$ = q => document.querySelectorAll(q);
var _$ = e => q => e.querySelector(q);
var _$$ = e => q => e.querySelectorAll(q);

String.prototype.reverse = function() {
  return this.split("").reverse().join("");
};

document.documentElement.addEventListener("click", () =>
  document.documentElement.webkitRequestFullscreen());

var windows = [];
var newWindow = (options) => {
  with (options) {
    var mode = options.mode || "elm";
    var topButtons = {
      left: (mode == "elm"
        ? ["hide"]
        : mode == "osx"
          ? ["close", "max", "hide"]
          : []),
      right: (mode == "elm"
        ? ["max"]
        : mode == "osx"
          ? []
          : ["hide", "max", "close"])
    }
    
    var elem = document.createElement("div");
    elem.id = `win-${id}`;
    elem.classList.add("win");
    elem.classList.add("initial-size");
    elem.innerHTML = `<div class="wintop" title="${title}">
  <div class="left">${topButtons.left.map(s => `<div class="icon ${s}"></div>`).join("")}</div><div class="right">${topButtons.right.map(s => `<div class="icon ${s}"></div>`).join("")}</div>
</div>
<div class="content"></div>"`;
    $(".window-layer").appendChild(elem);
    
    var trayListing = document.createElement("div");
    trayListing.id = `tray-${id}`;
    trayListing.classList.add("tray-listing");
    trayListing.innerHTML = `<div class="icon close"></div> <span class="name">${title} (${id})</span>`;
    $(".side-tray").appendChild(trayListing);
    
    var md = e => {
      offX = e.clientX - parseInt(elem.offsetLeft);
      offY = e.clientY - parseInt(elem.offsetTop);
      addEventListener("mousemove", mm, true);
      addEventListener("mouseup", mu, true);
    };
    var mu = () => {
      removeEventListener("mousemove", mm, true);
    };
    var mm = e => {
      if (elem.classList.contains("maximized"))
        maximize();
      if (e.clientX >= 0 && e.clientY >= 0 && e.clientX < innerWidth && e.clientY < innerHeight - 49) {
        elem.style.left = x = (e.clientX - offX) + "px";
        elem.style.top = y = (e.clientY - offY) + "px";
      }
    };
    var offX;
    var offY;
    
    var x;
    var y;
    var w;
    var h;
    
    var log = () => {
      x = elem.clientX;
      y = elem.clientY;
      w = elem.clientWidth;
      h = elem.clientHeight;
    };
    var toTop = () =>
      (elem.classList.remove("hidden"), $(".window-layer").appendChild(elem));
    var maximize = () => {
      if (elem.classList.contains("maximized")) {
        elem.classList.remove("maximized");
        elem.style.left = `${x}px`;
        elem.style.top = `${y}px`;
        elem.style.width = w;
        elem.style.height = h;
      } else {
        log();
        elem.classList.add("maximized");
        elem.style.top = `0`;
        elem.style.left = `0`;
        elem.style.width = innerWidth - 1;
        elem.style.height = innerHeight - 50;
      }
    };
    var close = () =>
      ($(".window-layer").removeChild($(`#win-${id}`)), $(".side-tray").removeChild($(`#tray-${id}`)));
    
    
    elem.addEventListener("mousedown", toTop);
    _$(elem)(".wintop").addEventListener("mousedown", md, true);
    if (_$(elem)(".hide"))
      _$(elem)(".hide").addEventListener("click", () =>
        elem.classList.add("hidden"));
    if (_$(elem)(".max"))
      _$(elem)(".max").addEventListener("click", maximize);
    if (_$(elem)(".close"))
      _$(elem)(".close").addEventListener("mouseup", close);
    
    trayListing.addEventListener("click", toTop);
    _$(trayListing)(".close").addEventListener("mouseup", close);
    
    return elem;
  }
};

var terminal = newWindow({
  id: "terminal",
  title: "terminal"
});

_$(terminal)(".content").innerHTML = "";
