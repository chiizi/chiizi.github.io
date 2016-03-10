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
    vx += ax * secs
    vy += ay * secs
    vz += az * secs
    
    x += vx * secs
    y += vy * secs
    z += vz * secs
  }
}

var vertex = (x, y, z) => ({
  x, y, z
})
var vertex2D = (x, y) => ({
  x, y
})
var line = (...a) => ({
  va: vertex(...a),
  vb: vertex(...a.slice(3))
})
var cube = (c, side) => (d => ({
  center: c,
  vertices: [
    vertex(c.x - d, c.y - d, c.z + d),
    vertex(c.x - d, c.y - d, c.z - d),
    vertex(c.x + d, c.y - d, c.z - d),
    vertex(c.x + d, c.y - d, c.z + d),
    vertex(c.x + d, c.y + d, c.z + d),
    vertex(c.x + d, c.y + d, c.z - d),
    vertex(c.x - d, c.y + d, c.z - d),
    vertex(c.x - d, c.y + d, c.z + d)
  ],
  lines: [
    line(c.x - d, c.y - d, c.z - d, c.x + d, c.y - d, c.z - d),
    line(c.x - d, c.y - d, c.z - d, c.x - d, c.y - d, c.z + d),
    line(c.x - d, c.y - d, c.z - d, c.x - d, c.y + d, c.z - d),
    line(c.x + d, c.y - d, c.z - d, c.x + d, c.y - d, c.z + d),
    line(c.x + d, c.y - d, c.z - d, c.x + d, c.y + d, c.z - d),
    line(c.x - d, c.y - d, c.z + d, c.x - d, c.y + d, c.z + d),
    line(c.x - d, c.y - d, c.z + d, c.x + d, c.y - d, c.z + d),
    line(c.x + d, c.y - d, c.z + d, c.x + d, c.y + d, c.z + d),
    line(c.x - d, c.y + d, c.z - d, c.x + d, c.y + d, c.z - d),
    line(c.x - d, c.y + d, c.z - d, c.x - d, c.y + d, c.z + d),
    line(c.x + d, c.y + d, c.z - d, c.x + d, c.y + d, c.z + d),
    line(c.x - d, c.y + d, c.z + d, c.x + d, c.y + d, c.z + d)
  ]
}))(side / 2)

var d = 200
var project = M => (r => r * M.x, r * M.z)(d / M.y)

function update(objects) {
  
}

function render(objects, ctx, dx, dy) {
  // Clear the previous frame
  ctx.clearRect(0, 0, 2*dx, 2*dy);

  objects.forEach(o => {
    if (o.vertices || false) o.vertices.forEach(v => {
      var P = project(v)
      ctx.fillRect(P.x + dx - 5, -P.y + dy - 5, 10, 10)
    })
    if (o.lines || false) o.lines.forEach(l => {
      var P = project(l.va)
      ctx.moveTo(P.x + dx, dy - P.y)
      P = project(l.vb)
      ctx.lineTo(P.x + dx, dy - P.y)
      
      ctx.closePath()
      ctx.stroke()
    })
  })
}

/*(function() {

  // Create the cube
  var cube_center = new Vertex(0, 11*dy/10, 0);
  var cube = new Cube(cube_center, dy);
  var objects = [cube];

  // First render
  render(objects, ctx, dx, dy);

  // Events
  var mousedown = false;
  var mx = 0;
  var my = 0;

  canvas.addEventListener('mousedown', initMove);
  document.addEventListener('mousemove', move);
  document.addEventListener('mouseup', stopMove);

  // Rotate a vertice
  function rotate(M, center, theta, phi) {
        // Rotation matrix coefficients
      var ct = Math.cos(theta);
      var st = Math.sin(theta);
      var cp = Math.cos(phi);
      var sp = Math.sin(phi);

    // Rotation
    var x = M.x - center.x;
    var y = M.y - center.y;
    var z = M.z - center.z;

    M.x = ct * x - st * cp * y + st * sp * z + center.x;
    M.y = st * x + ct * cp * y - ct * sp * z + center.y;
    M.z = sp * y + cp * z + center.z;
  }

  // Initialize the movement
  function initMove(evt) {
    clearTimeout(autorotate_timeout);
    mousedown = true;
    mx = evt.clientX;
    my = evt.clientY;
  }

  function move(evt) {
    if (mousedown) {
      var theta = (evt.clientX - mx) * Math.PI / 360;
      var phi = (evt.clientY - my) * Math.PI / 180;

      for (var i = 0; i < 8; ++i)
        rotate(cube.vertices[i], cube_center, theta, phi);

      mx = evt.clientX;
      my = evt.clientY;

      render(objects, ctx, dx, dy);
    }
  }

  function stopMove() {
    mousedown = false;
    autorotate_timeout = setTimeout(autorotate, 2000);
  }

  function autorotate() {
    objects.map(o => {
      for (var i = 0; i < o.vertices.length; ++i)
        rotate(o.vertices[i], cube_center, -Math.PI / 720, Math.PI / 720);
    })
    
    render(objects, ctx, dx, dy);

    autorotate_timeout = setTimeout(autorotate, 30);
  }
  autorotate_timeout = setTimeout(autorotate, 2000);
})();*/

var cube_center = new Vertex(0, 11 * dy / 10, 0)
var cube = new Cube(cube_center, dy)
var objects = [cube]

var main = objects => () => {
  update(objects)
  render(objects, ctx, dx, dy)
  requestAnimationFrame(main(objects))
}

main(objects)()
