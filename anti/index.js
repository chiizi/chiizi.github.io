const canvas = document.querySelector("canvas")
var dx = canvas.width = innerWidth
var dy = canvas.height = innerHeight
const ctx = canvas.getContext("2d")
var fov = 200

const pyth = (a, b) => Math.sqrt(Math.abs(a) * Math.abs(a) + Math.abs(b) * Math.abs(b))

const color = function(c) {
  const c = c || 0
  const a = 255 - (c / 0x01000000 & 0xFF)
  const r = c >> 0x10 & 0xFF
  const g = c >> 0x08 & 0xFF
  const b = c >> 0x00 & 0xFF
  
  return {
    r, g, b, a, c,
    get string() {
      return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a / 255})`
    }
  }
}
const stroke = function(color, w) {
  return {
    color,
    width(z) {
      return w instanceof function
        ? w(z)
        : w
    }
  }
}

const vertex = (f => f(f))(maker => (x, y, z) => Object.assign([x, y, z], {
  get x() {
    return this[0]
  },
  get y() {
    return this[1]
  },
  get z() {
    return this[2]
  },
  set x(v) {
    return this[0] = v
  },
  set y(v) {
    return this[1] = v
  },
  set z(v) {
    return this[2] = v
  }
  add(x, y, z) {
    return vertex(this[0] + x, this[1] + y, this[2] + z)
  },
  sub(x, y, z) {
    return vertex(this[0] - x, this[1] - y, this[2] - z)
  },
  scale(n) {
    return vertex(this[0] * x, this[1] * y, this[2] * z)
  },
  rotate(a) {
    const angle = Math.atan2(0 - this[2], 0 - this[0])
    return vertex(pyth(this[0], this[2]) * cos(angle + a), this[1], pyth(this[0], this[2]) * sin(angle + a))
  },
  get inv() {
    return vertex(-this[0], -this[1], -this[2])
  },
  set inv(v) {
    this.x = -v.x
    this.y = -v.y
    this.z = -v.z
    return this
  },
  get copy() {
    return vertex(...this)
  },
  maker
}))
const vertex2D = (f => f(f))(maker => (x, y) => Object.assign([x, y], {
  get x() {
    return this[0]
  },
  get y() {
    return this[1]
  },
  set x(v) {
    return this[0] = v
  },
  set y(v) {
    return this[1] = v
  },
  add(x, y) {
    return [this[0] + x, this[1] + y]
  },
  copy: vertex2D(...this),
  maker
}))
const line = (f => f(f))(maker => (v1, v2, stroke_) => Object.assign([v1, v2], {
  stroke: stroke_ || stroke(color(), 1),
  maker
}))
const lines = (f => f(f))(maker => (stroke, ...a) => ({
  lines: a.map(o => o.stroke = stroke),
  maker
}))
const poly = (f => f(f))(maker => (fill, stroke, ...a) => ({
  fill, stroke,
  vertices: a,
  maker
}))
const cube = (s, c, r) => lines(s, ...[
  line(c.add(-r, -r, -r), c.add(r, -r, -r)),
  line(c.add(-r, -r, -r), c.add(-r, -r, r)),
  line(c.add(r, -r, -r), c.add(r, -r, r)),
  line(c.add(-r, -r, r), c.add(r, -r, r)),
  
  line(c.add(-r, -r, -r), c.add(-r, r, -r)),
  line(c.add(r, -r, -r), c.add(r, r, -r)),
  line(c.add(-r, -r, r), c.add(-r, r, r)),
  line(c.add(r, -r, r), c.add(r, r, r)),
  
  line(c.add(-r, r, -r), c.add(r, r, -r)),
  line(c.add(-r, r, -r), c.add(-r, r, r)),
  line(c.add(r, r, -r), c.add(r, r, r)),
  line(c.add(-r, r, r), c.add(r, r, r))
])

const camera = (f => f(f))(maker => (x, y, z, angle, fov) => ({
  x, y, z, angle, fov,
  project(v) {
    return v.sub(this.x, this.y, this.z).rotate(this.angle)
  },
  maker
}))

const draw = c => ctx => o => {
  switch (o.maker) {
    case vertex:
      
      break;
  }
}
