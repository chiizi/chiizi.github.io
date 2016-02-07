$("shell-input").onsubmit = function() {
  this.parentElement.insertBefore(div({
    style: "font-family: monospace;",
    innerHTML: eval(this.value)
  }), this);
  this.value = "";
  return false;
};
