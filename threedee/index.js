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
// Objects style
var ctx = canvas.getContext("2d")
ctx.strokeStyle = "rgba(0, 0, 0, 0.3)"
ctx.fillStyle = "rgba(0, 150, 255, 0.3)"

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
var cube = (center, side) => (d => ({
  center,
  vertices: [
    new Vertex(center.x - d, center.y - d, center.z + d),
    new Vertex(center.x - d, center.y - d, center.z - d),
    new Vertex(center.x + d, center.y - d, center.z - d),
    new Vertex(center.x + d, center.y - d, center.z + d),
    new Vertex(center.x + d, center.y + d, center.z + d),
    new Vertex(center.x + d, center.y + d, center.z - d),
    new Vertex(center.x - d, center.y + d, center.z - d),
    new Vertex(center.x - d, center.y + d, center.z + d)
  ]
}))(side / 2)

var d = 200
var project = M => (r => vertex2D(r * M.x, r * M.z))(d / M.y)

var Vertex = function(x, y, z) {
  this.x = parseFloat(x);
  this.y = parseFloat(y);
  this.z = parseFloat(z);
};

var Vertex2D = function(x, y) {
  this.x = parseFloat(x);
  this.y = parseFloat(y);
};

var Cube = function(center, side) {
  // Generate the vertices
  var d = side / 2;

  this.vertices = [
        new Vertex(center.x - d, center.y - d, center.z + d),
        new Vertex(center.x - d, center.y - d, center.z - d),
        new Vertex(center.x + d, center.y - d, center.z - d),
        new Vertex(center.x + d, center.y - d, center.z + d),
        new Vertex(center.x + d, center.y + d, center.z + d),
        new Vertex(center.x + d, center.y + d, center.z - d),
        new Vertex(center.x - d, center.y + d, center.z - d),
        new Vertex(center.x - d, center.y + d, center.z + d)
  ];
};

function project(M) {
  // Distance between the camera and the plane
  var d = 200;
  var r = d / M.y;

  return new Vertex2D(r * M.x, r * M.z);
}

function render(objects, ctx, dx, dy) {
  // Clear the previous frame
  ctx.clearRect(0, 0, 2*dx, 2*dy);

  // For each object
  for (var i = 0, n_obj = objects.length; i < n_obj; ++i) {
    // For each point
    for (var j = 0, n_vertices = objects[i].vertices.length; j < n_vertices; ++j) {
      // Current face
      var vertex = objects[i].vertices[j];
      P = project(vertex);
      ctx.fillRect(P.x + dx - 5, -P.y + dy - 5, 10, 10)

      // Close the path and draw the face
      ctx.closePath();
      ctx.stroke();
      ctx.fill();
    }
  }
}

(function() {
  // Fix the canvas width and height
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  var dx = canvas.width / 2;
  var dy = canvas.height / 2;

  // Objects style
  var ctx = canvas.getContext('2d');
  ctx.strokeStyle = '#000';
  ctx.fillStyle = '#FFF';
  ctx.lineWidth = 6;

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
})();

function main() {
  update(objects)
  render(objects, ctx, dx, dy)
  requestAnimationFrame(main)
}

//main()
