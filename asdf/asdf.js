var keysDown = {};
addEventListener("keydown", e => keysDown[e.keyCode] = true);
addEventListener("keyup", e => delete keysDown[e.keyCode]);

var player = {
  x: 0,
  y: 0,
  speedx: 0,
  accel: 128 / 60,
  inAir: function() {return this.y > 0},
  jump: function() {
    
  },
  jumpQueued: false
};

function update() {
  if (!player.inAir()) {
    if (player.jumpQueued) {
      player.jump();
    }
    if (37 in keysDown) {
      player.speedx -= player.accel;
    } else if (37 in keysDown) {
      player.speedx += player.accel;
    } else {
      player.speedx /= 1.2;
    }
  }
  if (32 in keysDown) {
    if (player.inAir) {
      player.jumpQueued = true;
    } else {
      player.jump();
    }
  }
  player.y = Math.max(0, player.y);
};
