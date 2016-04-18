var Shell = _windowTemp({
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

var commands = [
  {
    checker: /^cd [A-Za-z,./~]/
  }
]

var shellFn = function(t) {
  var dir = `/home/${Sto("uname")}`;
  var content = "";
  var contentF = () => content.split("").map(e => e == " " ? "&nbsp;" : e);
  var position = 0;
  
  t.elem.style.backgroundColor = "#001";
  _$(t.elem)(".wintop").style.backgroundColor = "#223";
  _$$(t.elem)(".wintop .icon").map(e => e.style.backgroundColor = "#334");
  var shift = false;
  var kd = e => {
    _$(t.elem)(".uname").innerHTML = Sto("uname");
    _$(t.elem)(".hname").innerHTML = Sto("hname");
    _$(t.elem)(".dir").innerHTML = dir == `/home/${Sto("uname")}` ? "~" : dir;
    switch (e.keyCode) {
      case (16): {
        shift = true;
        break;
      }
      case (13): {
        _$(t.elem)(".lines").insertBefore($N("div")({
          className: "line",
          innerHTML: `[${Sto("uname")}@${Sto("hname")} ${dir.replace(new RegExp(`^/home/${Sto("uname")}`), "~") ? "~" : dir}] $ ${contentF().join("")}`
        }), _$(t.elem)(".in"));
        content = "";
      }
      case (8): {
        if (~["()", "[]"].indexOf(content.substr(position - 1, position)))
          content = content.substr(0, position - 1) + content.substr(position + 1);
        else if (~["()", "[]"].indexOf(content.substr(position - 2, position)))
          content = content.substr(0, position - 2) + content.substr(position);
        else
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
      case (186): {
        content = content.substr(0, position) + ":" + content.substr(position);
        position++;
        break;
      }
      case (191): {
        content = content.substr(0, position) + (shift ? "?" : "/") + content.substr(position);
        position++;
        break;
      }
      case (192): {
        content = content.substr(0, position) + "~" + content.substr(position);
        position++;
        break;
      }
      case (219): {
        content = content.substr(0, position) + "()" + content.substr(position);
        position++;
        break;
      }
      case (220): {
        content = content.substr(0, position) + "|" + content.substr(position);
        position++;
        break;
      }
      case (221): {
        content = content.substr(0, position) + "[]" + content.substr(position);
        position++;
        break;
      }
      case (222): {
        content = content.substr(0, position) + "\"" + content.substr(position);
        position++;
        break;
      }
      default: {
        break;
      }
    }
    if (e.keyCode >= 65 && e.keyCode <= 90) {
      content = content.substr(0, position) + String.fromCharCode(e.keyCode + (shift ? 0 : 32)) + content.substr(position);
      position++;
    }
    if (~[32].indexOf(e.keyCode) || (e.keyCode >= 48 && e.keyCode <= 57)) {
      content = content.substr(0, position) + String.fromCharCode(e.keyCode) + content.substr(position);
      position++;
    }
    if (~[188, 190].indexOf(e.keyCode)) {
      content = content.substr(0, position) + String.fromCharCode(e.keyCode - 144) + content.substr(position);
      position++;
    }
    if (~[].indexOf(e.keyCode)) {
      content = content.substr(0, position) + String.fromCharCode(e.keyCode - 128) + content.substr(position);
      position++;
    }
    position = Math.min(content.length, Math.max(0, position));
    _$(t.elem)(".caretl").innerHTML = contentF().slice(0, position).join("");
    _$(t.elem)(".caret").innerHTML = content[position] || "&nbsp;";
    _$(t.elem)(".caretr").innerHTML = contentF().slice(position + 1).join("");
    e.preventDefault();
  };
  kd({keyCode: null, preventDefault: () => null});
  
  $e(t.elem)("keydown")(kd);
  $e(t.elem)("keyup")(e => e.keyCode == 16
    ? shift = false
    : null)
  
  setInterval(() =>
    _$(t.elem)(".caret").classList.toggle("inv"), 500);
};
