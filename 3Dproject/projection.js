var canvas = document.querySelector("canvas")
var ctx = canvas.getContext("2d")

var setPixel = function(imagedata, x, y, r, g, b, a) {
  var i = ((y >> 0) * imagedata.width + (x >> 0)) * 4
  
  imagedata.data[i] = r
  imagedata.data[i + 1] = g
  imagedata.data[i + 2] = b
  imagedata.data[i + 3] = a || 255
}
var xyz = a => [a[x], a[y], a[z]]
var x = 0, y = 1, z = 2, vx = 3, vy = 4, vz = 5, ax = 6, ay = 7

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

var project = function(x, y, z, fov) {
  return [(x * fov / (fov + z)) + innerWidth / 2, (y * fov / (fov + z)) + innerHeight / 2]
}
var update = function(then) {
  var now = Date.now()
  var mod = now - then / 1000
  
  off.x += (m.x - off.x) * 6 * mod
  off.y += (m.y - off.y) * 6 * mod
  
  var i = points.length
  var point
  while (i --> 0) {
    point = points[i]
    if (point[z] <- fov) point[z] += (fov * 2)
  }
  setTimeout(() => update(now), 10)
}

var render = function(ctx) {
  requestAnimationFrame(() => render(ctx))
  t.clear(canvas)
  
  var img = ctx.getImageData(0, 0, canvas.width, canvas.height)
  var dat = img.data
  points.map(p => project(...xyz(p), fov)).forEach(function(pixel) {
    setPixel(img, ...pixel, 255, 255, 255)
  })
  ctx.putImageData(img, 0, 0)
}

var start = function() {
  update(Date.now)
  render(ctx)
}

var m = {
  x: 0,
  y: 0
}
var onmousemove = function(e) {
  m.x = (innerWidth / 2 - e.clientX) * 0.1;
  m.y = (innerHeight / 2 - e.clientY) * 0.1;
}

onresize = function() {
  canvas.width = innerWidth
  canvas.height = innerHeight
}
onresize()
