js:
var Tuple2 = (() => {
  "use strict";
  
  return class {
    constructor(a, b) {
      Object.defineProperty(this, "a", {
        get: () => a,
        set: () => this
      });
      Object.defineProperty(this, "b", {
        get: () => b,
        set: () => this
      });
      Object.defineProperty(this, "array", {
        get: () => [a, b],
        set: () => this
      });
      Object.defineProperty(this, "deepArray", {
        get: () => (f => f([a, b], f, Tuple2, "array"))((a, f, c, k) => a.map(e => e instanceof c
          ? f(e[k], f, c, k)
          : e)),
        set: () => this
      });
      Object.defineProperty(this, "swap", {
        get: () => new Tuple2(b, a),
        set: () => this
      });
    }
  };
})();

Tuple2.fromArray = array =>
  new Tuple2(array[0], array[1]);

var $ = (a, b) => new Tuple2(a, b);
