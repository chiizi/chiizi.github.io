var $ = q => document.querySelector(q);
var $$ = q => document.querySelectorAll(q);

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
    
    var elem = window.topElem = document.createElement("div");
    elem.id = `win-${id}`;
    elem.classList.add("win");
    elem.classList.add("initial-size");
    elem.innerHTML = `<div class="wintop" title="${title}">
  <div class="left">${topButtons.left.map(s => `<div class="icon ${s}"></div>`).join("")}</div><div class="right">${topButtons.right.map(s => `<div class="icon ${s}"></div>`).join("")}</div>
</div>`;
    $(".window-layer").appendChild(elem);
    
    var trayListing = document.createElement("div");
    trayListing.id = `tray-${id}`;
    trayListing.classList.add("tray-listing");
    trayListing.innerHTML = `<div class="icon close"></div> <span class="name">${title} (${id})</span>`;
    $(".side-tray").appendChild(trayListing);
    
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
      if (elem.classList.contains("maximized"))
        maximize();
      if (e.clientX >= 0 && e.clientY >= 0 && e.clientX < innerWidth && e.clientY < innerHeight - 49) {
        elem.style.left = xval = (e.clientX - offX) + "px";
        elem.style.top = xval = (e.clientY - offY) + "px";
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
    }
    var toTop = () =>
      (elem.classList.remove("hidden"), $(".window-layer").appendChild(elem));
    var maximize = () => {
      if (elem.classList.contains("maximized")) {
        elem.classList.remove("maximized");
        elem.style.top = `${y}px`;
        elem.style.left = `${x}px`;
        elem.style.width = w;
        elem.style.height = h;
      } else {
        log();
        elem.classList.add("maximized");
        elem.style.width = innerWidth;
        elem.style.height = innerHeight - 49;
      }
    };
      
    var close = window.closeTopWin = () =>
      ($(".window-layer").removeChild($(`#win-${id}`)), $(".side-tray").removeChild($(`#tray-${id}`)));
    
    
    elem.addEventListener("mousedown", toTop);
    elem.querySelector(".wintop").addEventListener("mousedown", md, true);
    if (elem.querySelector(".hide"))
      elem.querySelector(".hide").addEventListener("click", () =>
        elem.classList.add("hidden"));
    if (elem.querySelector(".max"))
      elem.querySelector(".max").addEventListener("click", maximize);
    if (elem.querySelector(".close"))
      elem.querySelector(".close").addEventListener("click", close);
    
    trayListing.addEventListener("click", toTop);
    trayListing.querySelector(".close").addEventListener("click", close);
    
    return elem;
  }
};

var test = newWindow({
  id: "test",
  title: "test"
});
var osx = newWindow({
  mode: "osx",
  id: "osx",
  title: "osx test"
});
