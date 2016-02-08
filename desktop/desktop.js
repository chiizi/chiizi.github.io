"slice map forEach".split(" ").forEach(k => Object.prototype[k] = Array.prototype[k]);
var $N = tag => o => (e => ((o.children !== undefined
  ? (o.children.map(c => e.appendChild(c)), delete o.children)
  : null),
  Object.assign(e, o)))(document.createElement(tag));
var $ = q => document.querySelector(q);
var $$ = q => document.querySelectorAll(q);
var _$ = e => q => e.querySelector(q);
var _$$ = e => q => e.querySelectorAll(q);
var $e = q => e => f => q.addEventListener(e, f);
var $$e = q => e => f => $$(q).map(g => g.addEventListener(e, f));
var $A = p => c => p.appendChild(c);

var div = $N("div");

String.prototype.reverse = function() {
  return this.split("").reverse().join("");
};

var getScript = function(s) {
  if (!(gotten.indexOf(s) + 1))
    $A($("body"))($N("script")({
      src: s
    })).onload = () => gotten.push(s);
};
var gotten = [];

var tabIndex = 0;

var uname = "j-doe";
var hname = "glass";

document.documentElement.addEventListener("click", () =>
  document.documentElement.webkitRequestFullscreen());

var TrayListing = (function() {
  "use strict";
  
  return class {
    constructor(win) {
      var elem = div({
        id: `tray-${win.group}-${win.id}`,
        className: "tray-listing",
        children: [div({
          className: "icon close"
        }), $N("span")({
          className: "name",
          innerHTML: `${win.title} (${win.group}-${win.id})`
        })]
      });
      elem.addEventListener("click", win.toTop.bind(win));
      _$(elem)(".close").addEventListener("mouseup", win.close.bind(win));
      this.elem = elem;
    }
    toBottom() {
      $(".side-tray").appendChild(this.elem);
    }
    toTop() {
      $(".side-tray").insertBefore(this.elem, $(".side-tray").childNodes[0]);
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
          elem.style.left = this.log.x = (e.clientX - offX) + "px";
          elem.style.top = this.log.y = (e.clientY - offY) + "px";
        }
      };
      var offX;
      var offY;
      
      this.id = options.id;
      this.title = options.title;
      var elem = div({
        id: `win-${metaOptions.group}-${options.id}`,
        className: "win",
        tabIndex: tabIndex++,
        children: [div({
          className: "wintop",
          title: options.title || "untitled",
          children: [div({
            className: "left",
            children: mode[0] == "win"
              ? mode[1] == "web"
                ? [div({
                  className: "icon reload"
                }), div({
                  className: "icon back"
                })]
                : mode[1] == "std"
                  ? [div({
                    className: "icon reload"
                  })]
                  : []
              : mode[0] == "osx"
                ? [div({
                  className: "icon close"
                }), div({
                  className: "icon max"
                }), div({
                  className: "icon hide"
                })]
                : mode[1] == "web"
                  ? [div({
                    className: "icon hide"
                  }), div({
                    className: "icon reload"
                  }), div({
                    className: "icon back"
                  })]
                  : mode[1] == "std"
                    ? [div({
                      className: "icon hide"
                    }), div({
                      className: "icon reload"
                    })]
                    : [div({
                      className: "icon hide"
                    })]
          }), div({
            className: "right",
            children: mode[0] == "win"
              ? [div({
                className: "icon hide"
              }), div({
                className: "icon max"
              }), div({
                className: "icon close"
              })]
              : mode[0] == "osx"
                ? []
                : [div({
                  className: "icon max"
                })]
          })]
        }), div({
          className: "content",
          children: metaOptions.content(options)
        })]
      });
      
      this.log = () => {
        this.log.x = elem.clientX;
        this.log.y = elem.clientY;
        this.log.w = elem.clientWidth;
        this.log.h = elem.clientHeight;
      };
      
      elem.addEventListener("mousedown", this.toTop.bind(this));
      _$(elem)(".wintop").addEventListener("mousedown", md, true);
      if (_$(elem)(".hide"))
        _$(elem)(".hide").addEventListener("click", () =>
          elem.classList.add("hidden"));
      if (_$(elem)(".max"))
        _$(elem)(".max").addEventListener("click", this.maximize.bind(this));
      if (_$(elem)(".close"))
        _$(elem)(".close").addEventListener("mouseup", this.close.bind(this));
      
      this.elem = elem;
      this.trayListing = new TrayListing(this);
      this.trayListing.toTop();
      
      metaOptions.onmake(this);
    }
    toTop() {
      this.trayListing.toTop();
      this.elem.classList.remove("hidden");
      $(".window-layer").appendChild(this.elem);
    }
    maximize() {
      if (this.elem.classList.contains("maximized")) {
        this.elem.classList.remove("maximized");
        this.elem.style.left = `${this.log.x}px`;
        this.elem.style.top = `${this.log.y}px`;
        this.elem.style.width = this.log.w;
        this.elem.style.height = this.log.h;
      } else {
        this.log();
        this.elem.classList.add("maximized");
        this.elem.style.top = `0`;
        this.elem.style.left = `0`;
        this.elem.style.width = innerWidth - 1;
        this.elem.style.height = innerHeight - 50;
      }
    }
    close() {
      $(".window-layer").removeChild(this.elem);
      $(".side-tray").removeChild(this.trayListing.elem)
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
var Browser = new WindowTemp({
  group: "browser",
  mode: "elm.web",
  onmake: () => null,
  content: () => []
});

var mainBrowser = new Browser({
  title: "Vrowser",
  id: "main"
});
mainBrowser.toTop();

$A($("body"))($N("script")({
  src: "./shell.js",
  onload: function() {
    window.mainCL = new Shell({
      title: "Shell",
      id: "main"
    });
    mainCL.toTop();
  }
}));
