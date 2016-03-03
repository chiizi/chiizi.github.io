```
{
  var make = p => c => {
    var o = Object.seal(Object.assign(Object.assign({}, p), c || {}))
    recursiveSelfer(o)
    return o
  }
  var recursiveSelfer = (o, p) => {
    for (var k in o)
      o[k] = o[k] instanceof Function
        ? selfer(o, p)(k)
        : o[k] instanceof Object
          ? recursiveSelfer(o[k], p || o)
          : o[k]
    return o
  }
  var selfer = (o, p) => k => (...a) => o[k](p != {} ? p : o, ...a)
} // weird stuff

const color = make({
  r: 0,
  g: 0,
  b: 0,
  a: 0,
  toHex(self) {
    return "#" + [self.r, self,g, self.b].map(n => n.toString(16).length == 1 ? "0" + n.toString(16) : n.toString(16)).join("")
  }
})
```

Another one:

```
const color = function(_c) {
  var _c = _c || 0
  var a, r, g, b
  a = _c /*>> 0x18*/ / 0x01000000 & 0xFF
  r = _c >> 0x10 & 0xFF
  g = _c >> 0x08 & 0xFF
  b = _c >> 0x00 & 0xFF
  
  return Object.freeze({
    r, g, b, a,
    toString() {
      return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`
    }
  })
}
