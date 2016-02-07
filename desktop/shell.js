$(".shell-input").onsubmit = function() {
  this.insertBefore(div({
    innerHTML: eval(_$(this)("input").value)
  }), _$(this)("input"));
  _$(this)("input").value = "";
  return false;
};
