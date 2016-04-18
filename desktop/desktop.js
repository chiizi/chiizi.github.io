window.onerror = function (e, u, l) {
  alert(`error: ${ e }
URL: ${ u }
line: ${ l }`)
}
"slice map forEach".split(" ").forEach(k => Object.prototype[k] = Array.prototype[k])
var $N = tag => o => (e => (o.children !== undefined ? (o.children.map(c => e.appendChild(c)), delete o.children) : null, Object.assign(e, o)))(document.createElement(tag))
var $ = q => document.querySelector(q)
var $$ = q => document.querySelectorAll(q)
var _$ = e => q => e.querySelector(q)
var _$$ = e => q => e.querySelectorAll(q)
var $e = q => e => f => q.addEventListener(e, f)
var $$e = q => e => f => $$(q).map(g => g.addEventListener(e, f))
var $A = p => c => p.appendChild(c)
var Sto = (k, ...a) => a.length ? localStorage.setItem(k, a[0]) : localStorage.getItem(k)
var Ses = (k, ...a) => a.length ? sessionStorage.setItem(k, a[0]) : sessionStorage.getItem(k)
var div = $N("div")
String.prototype.reverse = function () {
  return this.split("").reverse().join("")
}
var getScript = function (s) {
  if (!(gotten.indexOf(s) + 1))
    $A($("body"))($N("script")({ src: s })).onload = () => gotten.push(s)
}
var gotten = []
var tabIndex = 0
if (!Sto("init")) {
  Sto("uname", "j-doe")
  Sto("hname", "glass")
  Sto("init", 1)
}
document.documentElement.addEventListener("click", () => document.documentElement.webkitRequestFullscreen())
var _trayListing = function (win) {
  var elem = div({
    id: `tray-${ win.group }-${ win.id }`,
    className: "tray-listing",
    children: [
      div({ className: "icon close" }),
      $N("span")({
        className: "name",
        innerHTML: `${ win.title } (${ win.group }-${ win.id })`
      })
    ]
  })
  elem.addEventListener("click", win.toTop.bind(win))
  _$(elem)(".close").addEventListener("mouseup", win.close.bind(win))
  return {
    elem,
    toBottom() {
      $(".side-tray").appendChild(elem)
    },
    toTop() {
      $(".side-tray").insertBefore(elem, $(".side-tray").childNodes[0])
    }
  }
}
var _windowTemp = function (metaOptions) {
  var mode = (metaOptions.mode || "elm.min").split(".")
  return options => {
    var md = e => {
      offX = e.clientX - parseInt(elem.offsetLeft)
      offY = e.clientY - parseInt(elem.offsetTop)
      addEventListener("mousemove", mm, true)
      addEventListener("mouseup", mu, true)
    }
    var mu = () => {
      removeEventListener("mousemove", mm, true)
    }
    var mm = e => {
      if (elem.classList.contains("maximized"))
        ret.maximize()
      if (e.clientX >= 0 && e.clientY >= 0 && e.clientX < innerWidth && e.clientY < innerHeight - 49) {
        elem.style.left = ret.log.x = e.clientX - offX + "px"
        elem.style.top = ret.log.y = e.clientY - offY + "px"
      }
    }
    var offX
    var offY
    var id = options.id
    var title = options.title
    var elem = div({
      id: `win-${ metaOptions.group }-${ options.id }`,
      className: "win",
      tabIndex: tabIndex++,
      children: [
        div({
          className: "wintop",
          title: options.title || "untitled",
          children: [
            div({
              className: "left",
              children: mode[0] == "win" ? mode[1] == "web" ? [
                div({ className: "icon reload" }),
                div({ className: "icon back" })
              ] : mode[1] == "std" ? [div({ className: "icon reload" })] : [] : mode[0] == "osx" ? [
                div({ className: "icon close" }),
                div({ className: "icon max" }),
                div({ className: "icon hide" })
              ] : mode[1] == "web" ? [
                div({ className: "icon hide" }),
                div({ className: "icon reload" }),
                div({ className: "icon back" })
              ] : mode[1] == "std" ? [
                div({ className: "icon hide" }),
                div({ className: "icon reload" })
              ] : [div({ className: "icon hide" })]
            }),
            div({
              className: "right",
              children: mode[0] == "win" ? [
                div({ className: "icon hide" }),
                div({ className: "icon max" }),
                div({ className: "icon close" })
              ] : mode[0] == "osx" ? [] : [div({ className: "icon max" })]
            })
          ]
        }),
        div({
          className: "content",
          children: metaOptions.content(options)
        })
      ]
    })
    var log = () => {
      log.x = elem.clientX
      log.y = elem.clientY
      log.w = elem.clientWidth
      log.h = elem.clientHeight
    }
    log()
    
    var ret = {
      mode,
      id,
      title,
      elem,
      toTop() {
        trayListing.toTop()
        elem.classList.remove("hidden")
        $(".window-layer").appendChild(elem)
      },
      maximize() {
        if (elem.classList.contains("maximized")) {
          elem.classList.remove("maximized")
          elem.style.left = `${ log.x }px`
          elem.style.top = `${ log.y }px`
          elem.style.width = log.w
          elem.style.height = log.h
        } else {
          log()
          elem.classList.add("maximized")
          elem.style.top = `0`
          elem.style.left = `0`
          elem.style.width = innerWidth - 1
          elem.style.height = innerHeight - 50
        }
      },
      close() {
        $(".window-layer").removeChild(elem)
        $(".side-tray").removeChild(trayListing.elem)
      },
      get group() {
        return metaOptions.group
      }
    }
    elem.addEventListener("mousedown", ret.toTop.bind(ret))
    _$(elem)(".wintop").addEventListener("mousedown", md, true)
    if (_$(elem)(".hide"))
      _$(elem)(".hide").addEventListener("click", () => elem.classList.add("hidden"))
    if (_$(elem)(".max"))
      _$(elem)(".max").addEventListener("click", ret.maximize.bind(ret))
    if (_$(elem)(".close"))
      _$(elem)(".close").addEventListener("mouseup", ret.close.bind(ret))
    var trayListing = _trayListing(ret)
    ret.trayListing = trayListing
    ret.trayListing.toTop()
    metaOptions.onmake(ret)
    ret.get = id => _$(".window-layer")(`#win-${ metaOptions.group }-${ id }`)
    return ret
  }
}
// **TODO**: add ability to define functionality with _windowTemp
var _windowGeneric = _windowTemp({ group: "generic" })
var _browser = _windowTemp({
  group: "browser",
  mode: "elm.web",
  onmake: () => null,
  content: () => []
})
var mainBrowser = _browser({
  title: "Vrowser",
  id: "main"
})
mainBrowser.toTop()
$A($("body"))($N("script")({
  src: "./shell.js",
  onload: function () {
    window.mainCL = _shell({
      title: "Shell",
      id: "main"
    })
    mainCL.toTop()
  }
}))
