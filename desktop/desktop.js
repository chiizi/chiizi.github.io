var $N = tag => o => (e => ((o.children !== undefined
  ? (o.children.map(c => e.appendChild(c)), delete o.children)
  : null),
  Object.assign(e, o)))(document.createElement(tag));
var $ = q => document.querySelector(q);
var $$ = q => document.querySelectorAll(q);
var _$ = e => q => e.querySelector(q);
var _$$ = e => q => e.querySelectorAll(q);

String.prototype.reverse = function() {
  return this.split("").reverse().join("");
};

document.documentElement.addEventListener("click", () =>
  document.documentElement.webkitRequestFullscreen());

var TrayListing = (function() {
  "use strict";
  
  return class {
    constructor(win) {
      var elem = $N("div")({
        id: `tray-${win.group}-${win.id}`,
        className: "tray-listing",
        children: [$N("div")({
          className: "icon close"
        }), $N("span")({
          className: "name",
          innerHTML: `${win.title} (${win.group}-${win.id})`
        })]
      });
      elem.addEventListener("click", () => win.toTop.call(win));
      _$(elem)(".close").addEventListener("mouseup", () => win.close.call(win));
      this.elem = elem;
    }
    toBottom(elem) {
      elem = elem || this.elem;
      $(".side-tray").appendChild(elem);
    }
    toTop(elem) {
      elem = elem || this.elem;
      $(".side-tray").insertBefore(elem, $(".side-tray").childNodes[0]);
    }
  };
})();
var WindowTemp = function(metaOptions) {
  "use strict";
  var mode = (metaOptions.mode || "elm.min").split(".");
  
  var ret = class {
    constructor(options) {
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
          this.maximize();
        if (e.clientX >= 0 && e.clientY >= 0 && e.clientX < innerWidth && e.clientY < innerHeight - 49) {
          elem.style.left = elem.log.x = (e.clientX - offX) + "px";
          elem.style.top = elem.log.y = (e.clientY - offY) + "px";
        }
      };
      var offX;
      var offY;
      
      this.id = options.id;
      this.title = options.title;
      var elem = $N("div")({
        id: `win-${metaOptions.group}-${options.id}`,
        className: "win",
        children: [$N("div")({
          className: "wintop",
          title: options.title || "untitled",
          children: [$N("div")({
            className: "left",
            children: mode[0] == "win"
              ? mode[1] == "web"
                ? [$N("div")({
                  className: "icon reload"
                }), $N("div")({
                  className: "icon back"
                })]
                : mode[1] == "std"
                  ? [$N("div")({
                    className: "icon reload"
                  })]
                  : []
              : mode[0] == "osx"
                ? [$N("div")({
                  className: "icon close"
                }), $N("div")({
                  className: "icon max"
                }), $N("div")({
                  className: "icon hide"
                })]
                : mode[1] == "web"
                  ? [$N("div")({
                    className: "icon hide"
                  }), $N("div")({
                    className: "icon reload"
                  }), $N("div")({
                    className: "icon back"
                  })]
                  : mode[1] == "std"
                    ? [$N("div")({
                      className: "icon hide"
                    }), $N("div")({
                      className: "icon reload"
                    })]
                    : [$N("div")({
                      className: "icon hide"
                    })]
          }), $N("div")({
            className: "right",
            children: mode[0] == "win"
              ? [$N("div")({
                className: "icon hide"
              }), $N("div")({
                className: "icon max"
              }), $N("div")({
                className: "icon close"
              })]
              : mode[0] == "osx"
                ? []
                : [$N("div")({
                  className: "icon max"
                })]
          })]
        })]
      });
      
      elem.log = () => {
        elem.log.x = elem.clientX;
        elem.log.y = elem.clientY;
        elem.log.w = elem.clientWidth;
        elem.log.h = elem.clientHeight;
      };
      
      elem.addEventListener("mousedown", () => this.toTop(this.elem));
      _$(elem)(".wintop").addEventListener("mousedown", md, true);
      if (_$(elem)(".hide"))
        _$(elem)(".hide").addEventListener("click", () =>
          elem.classList.add("hidden"));
      if (_$(elem)(".max"))
        _$(elem)(".max").addEventListener("click", () => this.maximize(this.elem));
      if (_$(elem)(".close"))
        _$(elem)(".close").addEventListener("mouseup", () => this.close(this.elem));
      
      this.elem = elem;
      this.trayListing = new TrayListing(this);
      this.trayListing.toTop();
      elem.trayListing = this.trayListing;
    }
    toTop(elem) {
      console.log(this); // make up your mind, **this**, are you a Window or an element?
      elem = elem || this.elem;
      elem.classList.remove("hidden");
      $(".window-layer").appendChild(this.elem);
    }
    maximize(elem) {
      console.log(this);
      elem = elem || this.elem;
      if (elem.classList.contains("maximized")) {
        elem.classList.remove("maximized");
        elem.style.left = `${this.log.x}px`;
        elem.style.top = `${this.log.y}px`;
        elem.style.width = this.log.w;
        elem.style.height = this.log.h;
      } else {
        elem.log();
        elem.classList.add("maximized");
        elem.style.top = `0`;
        elem.style.left = `0`;
        elem.style.width = innerWidth - 1;
        elem.style.height = innerHeight - 50;
      }
    }
    close(elem) {
      console.log(this);
      elem = elem || this.elem;
      $(".window-layer").removeChild(elem);
      $(".side-tray").removeChild(elem.trayListing.elem)
    }
    get group() {
      return metaOptions.group;
    }
  };
  
  ret.get = id =>
    _$(".window-layer")(`#win-${metaOptions.group}-${id}`);
  
  return ret;
}; // **TODO**: add ability to define functionality with WindowTemp or use class extends

var WindowGeneric = new WindowTemp({
  group: "generic"
});

var shell = new WindowTemp({
  group: "shell",
  mode: "elm.min"
});
