$(".shell-input").onsubmit = function() {
  this.parentElement.insertBefore(div({
    innerHTML: eval(this.value)
  }), this);
  this.value = "";
  return false;
};
