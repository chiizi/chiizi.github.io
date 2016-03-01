var canvas = document.createElement("canvas")
var ctx = canvas.getContext("2d")
document.body.appendChild("canvas")
canvas.x = 0
canvas.y = 0
(onresize = function() {
  canvas.width = innerWidth
  canvas.height = innerHeight
})()
var x = 0, y = 1, z = 2, vx = 3, vy = 4, vz = 5, ax = 6, ay = 7, az = 8, jx = 9, jy = 10, jz = 11

var fov = 400
var off = {x: 0, y: 0}

var points = (function(p) {
  for (var x = -250; x < 250; x += 5) {
    for (var z = -250; z < 250; z += 5) {
      p.push([x, 40, z, 0, 0, 16, 0, 0, 0])
  	}
  }
  return p
})([])

var t = {
  clear(o) {
    ctx.clearRect(o.x || 0, o.y || 0, o.width, o.height)
  }
}

var render = function(points, fov, pf) {
  var scale, point, x2d, y2d
  t.clear(canvas)
  var scale
  var i = points.length
  while (i --> 0) {
    point = points[i]
    scale = fov / (fov + point[3])
    var x2d = (point[0] * scale) + halfWidth
    var y2d = (pixel[1] * scale) + halfHeight
    pf(x2d, y2d)
  }
  requestAnimationFrame(render)
}
var update = function(then) {
  var now = Date.now()
  var mod = now - then / 1000
  
  off.x += (m.x - off.x) * 0.1
  off.y += (m.y - off.y) * 0.1
  
  var i = points.length
  var point
  while (i --> 0) {
    point = points[i]
    if (point[z] <- fov) points[i].z += (fov * 2)
  }
  setTimeout(() => update(now), 1000 / 60)
}
var start = function() {
  update(Date.now)
  render()
}

var m = {
  x: 0,
  y: 0
}
var onmousemove = function(e) {
  m.x = (innerWidth / 2 - e.clientX) * 0.1;
  m.y = (innerHeight / 2 - e.clientY) * 0.1;
}
