var $ = s => document.querySelector(s)
var $$ = s => document.querySelectorAll(s)
var $N = t => p => Object.assign(document.createElement(t), p)
var $APPEND = ea => eb => ea.appendChild(eb)

var beep = new Audio("./beep.wav")
var wrap = $("#controls")

var cycle = function(...t) {
  var go = true
  t = t.map(n => n * 1000)
  (function f(t) {
    beep.play()
    if (go)
      setTimeout(function() {
        f([...t.slice(1), t[0]])
      })
  })(t)
}

[$N("")]
