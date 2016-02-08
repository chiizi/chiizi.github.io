var Shell = new WindowTemp({
  group: "shell",
  mode: "elm.min",
  onmake: t => shellFn(t),
  content: () => [$N("link")({
    rel: "stylesheet",
    href: "./shell.css"
  }), $N("div")({
    className: "shell",
    children: [$N("div")({
      className: "lines",
      children: [$N("div")({
        className: "line",
        innerHTML: "loading kernel into ram..."
      }), $N("div")({
        className: "line",
        innerHTML: "lol jk this isn't a vm yet"
      }), $N("div")({
        className: "line in",
        innerHTML: `[<span class="uname"></span>@<span class="hname"></span> <span class="dir"></span>] $ <span class="caretl"></span><span class="caret"></span><span class="caretr">`
      })]
    })]
  })]
});

var shellFn = function(t) {
  var dir = `/home/${uname}`;
  var content = "";
  var position = 0;
  
  t.elem.style.backgroundColor = "#001";
  _$(t.elem)(".wintop").style.backgroundColor = "#223";
  _$(t.elem)(".wintop .icon").style.backgroundColor = "#334";
  var kd = e => {
    _$(t.elem)(".uname").innerHTML = uname;
    _$(t.elem)(".hname").innerHTML = hname;
    _$(t.elem)(".dir").innerHTML = dir == `/home/${uname}` ? "~" : dir;
    switch (e.keyCode) {
      case (13): {
        _$(t.elem)(".lines").insertBefore($N("div")({
          className: "line",
          innerHTML: content
        }), _$(t.elem)(".in"));
        content = "";
      }
      case (8): {
        content = content.substr(0, position - 1) + content.substr(position);
        // fall through
      }
      case (37): {
        position--;
        break;
      }
      case (39): {
        position++;
        break;
      }
      default: {
        break;
      }
    }
    if (e.keyCode >= 65 && e.keyCode <= 90) {
      content = content.substr(0, position) + String.fromCharCode(e.keyCode + 32) + content.substr(position);
      position++;
    }
    position = Math.min(content.length, Math.max(0, position));
    _$(t.elem)(".caretl").innerHTML = content.substr(0, position);
    _$(t.elem)(".caret").innerHTML = content[position] || "&nbsp;";
    _$(t.elem)(".caretr").innerHTML = content.substr(position + 1);
    e.preventDefault();
  };
  kd({keyCode: null, preventDefault: () => null});

  $e(t.elem)("keydown")(kd);

  setInterval(() =>
    _$(t.elem)(".caret").classList.toggle("inv"), 500);
};
