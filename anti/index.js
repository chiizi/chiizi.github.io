const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d")
var fov = 200

const pyth = (a, b) => Math.sqrt(Math.abs(a) * Math.abs(a) + Math.abs(b) * Math.abs(b))

const vertex = (x, y, z) => Object.assign([x, y, z], {
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
    return vertex(pyth(this[0], this[2]) * cos(a), this[1], pyth(this[0], this[2]) * sin(a))
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
  }
})
const vertex2D = (x, y) => Object.assign([x, y], {
  add(x, y) {
    return [this[0] + x, this[1] + y]
  },
  copy: vertex2D(...this)
})
const line = (v1, v2) => [v1, v2]
const lines = (...a) => ({
  lines: a
})
const cube = (c, r) => lines(...[
  line(center.add(-r, -r, -r), center.add(r, -r, -r)),
  line(center.add(-r, -r, -r), center.add(-r, -r, r)),
  line(center.add(r, -r, -r), center.add(r, -r, r)),
  line(center.add(-r, -r, r), center.add(r, -r, r)),
  
  line(center.add(-r, -r, -r), center.add(-r, r, -r)),
  line(center.add(r, -r, -r), center.add(r, r, -r)),
  line(center.add(-r, -r, r), center.add(-r, r, r)),
  line(center.add(r, -r, r), center.add(r, r, r))
  
  line(center.add(-r, r, -r), center.add(r, r, -r)),
  line(center.add(-r, r, -r), center.add(-r, r, r)),
  line(center.add(r, r, -r), center.add(r, r, r)),
  line(center.add(-r, r, r), center.add(r, r, r))
])

const camera = (x, y, z, angle, fov) => ({
  x, y, z, angle, fov,
  project(v) {
    return v.sub(this.x, this.y, this.z).rotate(this.angle)
  }
})
