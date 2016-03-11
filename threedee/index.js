window.onerror = function(e, u, l) {
  alert(`error: ${e}
URL: ${u}
line: ${l}`)
}

var keysDown = []
addEventListener("keydown", e =>
  keysDown[e.keyCode] = true)
addEventListener("keyup", e =>
  keysDown[e.keyCode] = false)

var canvas = document.querySelector("canvas")
canvas.width = canvas.offsetWidth
canvas.height = canvas.offsetHeight
var dx = canvas.width / 2
var dy = canvas.height / 2
var ctx = canvas.getContext("2d")
ctx.strokeStyle = "#000"
ctx.fillStyle = "#FFF"
ctx.lineWidth = 10
ctx.lineJoin = "bevel"

var player = {
  x: 0,
  y: 0,
  z: 0,
  vx: 0,
  vy: 0,
  vz: 0,
  ax: 0,
  ay: 0,
  az: 0,
  r: 0,
  rs: 0.5,
  step(secs) {
    this.vx += this.ax * secs
    this.vy += this.ay * secs
    this.vz += this.az * secs
    
    this.x += this.vx * secs
    this.y += this.vy * secs
    this.z += this.vz * secs
    
    if (this.y < 0) this.y = 0
  }
}

var vertex = (x, y, z) => Object.assign([x, y, z], {
  set x(v) {
    return this[0] = v
  },
  get x() {
    return this[0]
  },
  set y(v) {
    return this[1] = v
  },
  get y() {
    return this[1]
  },
  set z(v) {
    return this[2] = v
  },
  get z() {
    return this[2]
  }
})
var vertex2D = (x, y) => Object.assign([x, y], {
  set x(v) {
    return this[0] = v
  },
  get x() {
    return this[0]
  },
  set y(v) {
    return this[1] = v
  },
  get y() {
    return this[1]
  }
})
var line = (...a) => ({
  va: vertex(...a),
  vb: vertex(...a.slice(3))
})
var cube = (x, y, z, side) => (d => ({
  center: vertex(x, y, z),
  vertices: [
    vertex(x - d, y - d, z + d),
    vertex(x - d, y - d, z - d),
    vertex(x + d, y - d, z - d),
    vertex(x + d, y - d, z + d),
    vertex(x + d, y + d, z + d),
    vertex(x + d, y + d, z - d),
    vertex(x - d, y + d, z - d),
    vertex(x - d, y + d, z + d)
  ],
  lines: [
    line(x - d, y - d, z - d, x + d, y - d, z - d),
    line(x - d, y - d, z - d, x - d, y - d, z + d),
    line(x - d, y - d, z - d, x - d, y + d, z - d),
    line(x + d, y - d, z - d, x + d, y - d, z + d),
    line(x + d, y - d, z - d, x + d, y + d, z - d),
    line(x - d, y - d, z + d, x - d, y + d, z + d),
    line(x - d, y - d, z + d, x + d, y - d, z + d),
    line(x + d, y - d, z + d, x + d, y + d, z + d),
    line(x - d, y + d, z - d, x + d, y + d, z - d),
    line(x - d, y + d, z - d, x - d, y + d, z + d),
    line(x + d, y + d, z - d, x + d, y + d, z + d),
    line(x - d, y + d, z + d, x + d, y + d, z + d)
  ]
}))(side / 2)

var d = 200
var project = M => (r => vertex2D(r * M.x, r * M.y))(d / M.z)

var cube_center = vertex(0, 0, 11 * dy / 10)
var cube = cube(...cube_center, dy)
var objects = [cube]

var main = objects => () => {
  update(objects)
  render(objects, ctx, dx, dy)
  requestAnimationFrame(main(objects))
}

main(objects)()
