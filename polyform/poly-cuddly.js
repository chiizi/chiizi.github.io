var mouse = {x: 0, y: 0, width: 1, height: 1, in: false, down: false};

document.addEventListener("mousemove", function(e) { 
  mouse.x = e.clientX - canvas.getBoundingClientRect().left || e.pageX - canvas.getBoundingClientRect().left; 
  mouse.y = e.clientY - canvas.getBoundingClientRect().top || e.pageY - canvas.getBoundingClientRect().top;
}, false);
document.addEventListener("mousedown", function(e) {
  mouse.down = true;
});
document.addEventListener("mouseup", function(e) {
  mouse.down = false;
});
document.addEventListener("mouseleave", function(e) { 
  mouse.in = false;
}, false);
document.addEventListener("mouseenter", function(e) { 
  mouse.in = true;
}, false);

var canvas = new CuddlyWoof(25 * 32, 19 * 32);
canvas.append(document.body);

var game = {
  keysDown: {},
  keyboardReady: false,
  cursor: new Image(),
  easterEgg: false,
  menu: {
    open: false,
    trigger: false
  },
  debug: {
    open: false,
    trigger: false
  },
  player: {
    ready: true,
    moved: false,
    width: 32,
    height: 32,
    calcSpeed: 256,
    mainSpeed: 256,
    runSpeed: 1.5,
    specialSub: 2,
    running: false,
    special: false,
    score: 0,
    inv: Array.apply(null, Array(10)).map(function() {
      return {
        id: 0x0000
      };
    }),
    selection: false,
    img: (e => (e.src = "http://i.imgur.com/OiL81gs.png", e))(new Image()),
    draw: function() {
      canvas.image(this.image, this.x, this.y);
    }
  }
};
game.cursor.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAADNQTFRFAAAAM7XlM7XlM7XlM7XlM7XlM7XlM7XlM7XlM7XlM7XlM7XlM7XlM7XlM7XlM7XlM7Xl0EvUiQAAABB0Uk5TABAgMEBQYHCAj5+vv8/f7yMagooAAACZSURBVDjL3dMxEsQgCAVQRERjUP79T5ti3Sok1ru0vhn9gER/VbwDZeo7SMCGGDakAgCGPIKMT9kjmdiQDryTsk7dJnByGPQbhDvQ72QAGKkMwERh5QYaAFZXStWV46CdkYmIxFP0TIfWc10ncVBpbTU+BIqmtrom8URHciUiqjNu5oAWP0S65xg0nMTd7ODHicpm8dpvfqgL7HEHsOnkzpoAAAAASUVORK5CYII=";

addEventListener("keydown", function(e) {
  game.keysDown[e.keyCode] = true;
  return false;
}, false);

addEventListener("keyup", function(e) {
  delete game.keysDown[e.keyCode];
  return false;
}, false);

game.items = [
  {
    name: "NULL",
    id: 0x0000,
    sprites: {
      "32x32": "http://i.imgur.com/AsXyVLs.png"
    }
  },
  {
    name: "sword",
    id: 0x0001,
    sprites: {
      "32x32": "http://i.imgur.com/LC6VU9N.png"
    }
  }
];

game.items.error = {
  name: "ERROR",
  sprites: {
    "32x32": "http://i.imgur.com/hzPr4N6.png"
  }
};

game.getItem = function(id) {
  for (var i = 0; i < game.items.length; i++) {
    if (id == game.items[i].id) {
      return game.items[i];
    }
  }
  return game.items.error;
};

game.tiles = {
  thing: {
    draw: function(x, y) {
      var i = new Image();
      i.src = "http://i.imgur.com/OiL81gs.png";
      canvas.image(i, x, y);
    }
  },
  redCarpet: {
    draw: function(x, y) {
      canvas.color("#faa").rect.fill(x, y, 32, 32);
    }
  },
  blueCarpet: {
    draw: function(x, y) {
      canvas.color("#ccf").rect.fill(x, y, 32, 32);
    }
  },
  floor: {
    draw: function(x, y) {
      canvas.color("#eee").rect.fill(x, y, 32, 32);
    }
  },
  wall: {
    draw: function(x, y) {
      canvas.rect.fill(x, y, 32, 32);
    }
  },
  door: function(map, x, y) {
    this.draw = function(x, y) {
      canvas.color("#5C4742").rect.fill(x, y, 32, 32);
    };
    this.toMap = map;
    this.toX = x;
    this.toY = y;
    this.to = function() {
      game.map = this.toMap;
      game.player.x = this.toX;
      game.player.y = this.toY;
    };
    return this;
  }
};

game.maps = {
  bedroom: {
    name: "Your Bedroom",
    map: Array.apply(null, Array(19)).map(function() {return Array.apply(null, Array(25)).map(function() {return ".";});}),
    substitution: {
      ".": game.tiles.redCarpet,
      "#": game.tiles.wall
    },
    cheatyColDet: function(obj) {
      if (obj.x < 32) {
        obj.x = 32;
      }
      if (obj.x + obj.width > canvas.width - 32) {
        obj.x = canvas.width - (obj.width + 32);
      }
      if (obj.y < 32) {
        obj.y = 32;
      }
      if (obj.y + obj.width > canvas.height - 32) {
        obj.y = canvas.height - (obj.height + 32);
      }
    },
    doorChecks: [
      function(obj) {
        if (obj.x >= 11 * 32 && obj.x + obj.width <= 14 * 32 && obj.y + obj.height >= canvas.height - 32) {
          game.maps.bedroom.substitution["$1"].to();
        }
        if (obj.x >= 11 * 32 && obj.x + obj.width <= 14 * 32 && obj.y + obj.height >= canvas.height - 32) {
          game.maps.bedroom.substitution["$1"].to();
        }
      }
    ]
  },
  upstairsHall: {
    name: "The Upstairs Hall",
    map: Array.apply(null, Array(19)).map(function() {return Array.apply(null, Array(25)).map(function() {return ".";});}),
    substitution: {
      ".": game.tiles.floor,
      "#": game.tiles.wall
    },
    cheatyColDet: function(obj) {
      if (obj.x < 6 * 32) {
        obj.x = 6 * 32;
      }
      if (obj.x + obj.width > canvas.width - 6 * 32) {
        obj.x = canvas.width - (obj.width + 6 * 32);
      }
      if (obj.y < 32) {
        obj.y = 32;
      }
      if (obj.y + obj.width > canvas.height - 32) {
        obj.y = canvas.height - (obj.height + 32);
      }
    },
    doorChecks: [
      function(obj) {
        if (obj.x >= 11 * 32 && obj.x + obj.width <= 14 * 32 && obj.y <= 32) {
          game.maps.upstairsHall.substitution["$1"].to();
        }
      },
      function(obj) {
        if (obj.y >= 8 * 32 && obj.y + obj.width <= 11 * 32 && obj.x <= 6 * 32) {
          game.maps.upstairsHall.substitution["$2"].to();
        }
      }
    ]
  },
  parentsBedroom: {
    name: "Parents' Bedroom",
    map: Array.apply(null, Array(19)).map(function() {return Array.apply(null, Array(25)).map(function() {return ".";});}),
    substitution: {
      ".": game.tiles.blueCarpet,
      "#": game.tiles.wall
    },
    cheatyColDet: function(obj) {
      if (obj.x < 32) {
        obj.x = 32;
      }
      if (obj.x + obj.width > canvas.width - 32) {
        obj.x = canvas.width - (obj.width + 32);
      }
      if (obj.y < 32) {
        obj.y = 32;
      }
      if (obj.y + obj.width > canvas.height - 32) {
        obj.y = canvas.height - (obj.height + 32);
      }
    },
    doorChecks: [
      function(obj) {
        if (obj.y >= 8 * 32 && obj.y + obj.height <= 11 * 32 && obj.x + obj.width >= canvas.width - 32) {
          game.maps.parentsBedroom.substitution["$1"].to();
        }
      }
    ]
  }
};

game.renderMap = function(map) {
  for (var y = 0; y < 19; y++) {
    for (var x = 0; x < 25; x++) {
      game.map.substitution[game.map.map[y][x]].draw(x * 32, y * 32);
    }
  }
};

game.map = game.maps.bedroom;

game.binds = [
  {
    code: 27,
    action: function() {
      if (!game.menu.trigger) {
        game.menu.open = game.menu.open ? false : true;
        game.menu.trigger = true;
      }
    },
    anAction: function() {
      game.menu.trigger = false;
    }
  },
  {
    code: 16,
    action: function() {
      game.player.running = !game.player.special;
    },
    anAction: function() {
      game.player.running = false;
    }
  },
  {
    code: 17,
    action: function() {
      game.player.special = true;
    },
    anAction: function() {
      game.player.special = false;
    }
  },
  {
    code: 38,
    action: function(modifier) {
      game.player.y -= game.player.calcSpeed * modifier;
    }
  },
  {
    code: 40,
    action: function(modifier) {
      game.player.y += game.player.calcSpeed * modifier;
    }
  },
  {
    code: 37,
    action: function(modifier) {
      game.player.x -= game.player.calcSpeed * modifier;
    }
  },
  {
    code: 39,
    action: function(modifier) {
      game.player.x += game.player.calcSpeed * modifier;
    }
  },
  {
    code: 87,
    action: function(modifier) {
      game.player.y -= game.player.calcSpeed * modifier;
    }
  },
  {
    code: 83,
    action: function(modifier) {
      game.player.y += game.player.calcSpeed * modifier;
    }
  },
  {
    code: 65,
    action: function(modifier) {
      game.player.x -= game.player.calcSpeed * modifier;
    }
  },
  {
    code: 68,
    action: function(modifier) {
      game.player.x += game.player.calcSpeed * modifier;
    }
  },
  {
    code: 32,
    action: function() {
      game.player.ready = false;
      game.invIsOpen = true;
    },
    anAction: function() {
      game.player.ready = true;
      game.invIsOpen = false;
    }
  },
  {
    code: 192,
    action: function() {
      if (!game.debug.trigger) {
        game.debug.open = game.debug.open ? false : true;
        game.debug.trigger = true;
        return false;
      }
    },
    anAction: function() {
      game.debug.trigger = false;
    }
  }
];

game.objsTouching = function(a, b) {
  return a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y;
};

game.maintain = function() {
  "use strict";
  if (game.player.running) {
    game.player.calcSpeed = game.player.mainSpeed * game.player.runSpeed;
  } else if (game.player.special) {
    game.player.calcSpeed = game.player.mainSpeed / game.player.specialSub;
  } else {
    game.player.calcSpeed = game.player.mainSpeed;
  }
  if (game.menu.open) {
    game.player.ready = false;
  } else {
    game.player.ready = true;
  }
  if (game.invIsOpen) {
    game.player.calcSpeed = 96;
  }
  if (!game.player.ready) {
    game.player.calcSpeed = 0;
  }
  game.player.color = game.player.special ? [0, 68, 255, 1] : game.player.running ? [255, 0, 0, 1] : [0, 0, 0, 1];
  if (game.player.x < 0) {
    game.player.x = 0;
  }
  if (game.player.x + 32 > canvas.width) {
    game.player.x = canvas.width - 32;
  }
  if (game.player.y < 0) {
    game.player.y = 0;
  }
  if (game.player.y + 32 > canvas.height) {
    game.player.y = canvas.height - 32;
  }
  game.map.cheatyColDet(game.player);
  for (let i = 0; i < game.map.doorChecks.length; i++) {
    game.map.doorChecks[i](game.player);
  }
  game.player.x = Math.round(game.player.x / 2) * 2;
  game.player.y = Math.round(game.player.y / 2) * 2;
};

game.update = function(modifier) {
  for (var i = 0; i < game.binds.length; i++) {
    if (game.binds[i].code in game.keysDown) {
      game.binds[i].action(modifier);
    } else if (game.binds[i].anAction) {
      game.binds[i].anAction(modifier);
    }
  }
  game.maintain();
};

game.render = function() {
  canvas.clear();
  var inv32 = (function(i) {
    var ret = Array.apply(null, Array(10));
    for (var j = 0; j < i.length; j++) {
      ret[j] = new Image();
      ret[j].src = game.getItem(i[j].id).sprites["32x32"];
    }
    return ret;
  })(game.player.inv);
  
  game.renderMap(game.map);
  
  game.player.draw();
  
  canvas.ctx.shadowBlur = 16;
  canvas.ctx.shadowColor = "#fff";
  canvas.color("rgba(255, 255, 255, 0.5)")
   .rect.fill((canvas.width - 336) / 2, (canvas.height - 96) / 2, 336, 96);
  canvas.ctx.shadowBlur = 0;
  canvas.color("rgba(255, 255, 255, 0.6)")
   .rect.fill((canvas.width - 312) / 2, (canvas.height - 72) / 2, 312, 72);
  
  for (var i = 0; i < 5; i++) {
    canvas.color("rgba(192, 192, 192, " + (game.objsTouching(mouse, {x: (canvas.width - 288) / 2 + 60 * i, y: (canvas.height - 48) / 2, width: 48, height: 48}) ? "0.8" : "0.6") + ")")
     .rect.fill((canvas.width - 288) / 2 + 60 * i, (canvas.height - 48) / 2, 48, 48)
     .color("rgba(160, 160, 160, 0.6)")
     .rect.fill((canvas.width - 288) / 2 + 60 * i + 8, (canvas.height - 48) / 2 + 8, 32, 32)
     .image(inv32[i], (canvas.width - 288) / 2 + 60 * i + 8, (canvas.height - 48) / 2 + 8);
  }
  if (game.menu.open) {
    canvas.ctx.shadowBlur = 32;
    canvas.ctx.shadowColor = "#000";
    canvas.color("rgba(0, 0, 0, 0.8)")
     .rect.fill(16, 16, canvas.width - 32, canvas.height - 32);
    canvas.ctx.shadowBlur = 16;
    canvas.ctx.shadowColor = "#fff";
    canvas.color("rgba(255, 255, 255, 0.9)")
     .rect.fill(32, 32, canvas.width - 64, canvas.height - 64);
    canvas.ctx.shadowColor = "#000";
    
    canvas.color("rgba(0, 0, 0, " + (game.objsTouching(mouse, {x: 48, y: 48, width: (canvas.width - 96) / 2 - 8, height: 64}) ? "0.8" : "0.6") + ")")
     .rect.fill(48, 48, (canvas.width - 96) / 2 - 8, 64)
     .color("rgba(0, 0, 0, " + (game.objsTouching(mouse, {x: canvas.width / 2 + 8, y: 48, width: (canvas.width - 96) / 2 - 8, height: 64}) ? "0.8" : "0.6") + ")")
     .rect.fill(canvas.width / 2 + 8, 48, (canvas.width - 96) / 2 - 8, 64);
    
    canvas.ctx.shadowBlur = 0;
  }
  if (mouse.in) {
    canvas.image(game.cursor, mouse.x - 8, mouse.y - 7);
  }
  if (game.debug.open) {
    canvas.color("rgba(0, 0, 0, 1)");
    canvas.ctx.font = "15px Verdana";
    canvas.ctx.fillText("x: " + game.player.x + ", y: " + game.player.y + " score: " + game.player.score, 10, 20);
    canvas.ctx.fillText("speed: " + game.player.calcSpeed, 10, 40);
    canvas.ctx.fillText("map: " + game.map.name, 10, 60);
  }
}

game.main = function() {
  game.update();
  game.render();

  requestAnimationFrame(game.main);
};

game.player.x = canvas.width / 2 - 16;
game.player.y = canvas.height / 2 - 16;

game.maps.bedroom.substitution["$1"] = new game.tiles.door(game.maps.upstairsHall, game.player.x, 33);

game.maps.upstairsHall.substitution["$1"] = new game.tiles.door(game.maps.bedroom, game.player.x, canvas.height - (33 + game.player.width));
game.maps.upstairsHall.substitution["$2"] = new game.tiles.door(game.maps.parentsBedroom, canvas.width - (game.player.width + 33), game.player.y);

game.maps.parentsBedroom.substitution["$1"] = new game.tiles.door(game.maps.upstairsHall, 6 * 32 + 1, game.player.y);

game.maps.bedroom.map[0] = (function() {
  var a = [];
  for (var i = 0; i < 25; i++) {
    a.push("#");
  }
  return a;
})();
game.maps.bedroom.map[18] = game.maps.bedroom.map[0].slice(0);
game.maps.bedroom.map = game.maps.bedroom.map.map(function(e) {
  return ["#"].concat(e.slice(1, e.length - 1)).concat(["#"]);
});
game.maps.bedroom.map[18][11] = "$1";
game.maps.bedroom.map[18][12] = "$1";
game.maps.bedroom.map[18][13] = "$1";

game.maps.upstairsHall.map[0] = (function() {
  var a = [];
  for (var i = 0; i < 25; i++) {
    a.push("#");
  }
  return a;
})();
game.maps.upstairsHall.map[18] = game.maps.upstairsHall.map[0].slice(0);
game.maps.upstairsHall.map = game.maps.upstairsHall.map.map(function(e) {
  return ["#", "#", "#", "#", "#", "#"].concat(e.slice(6, e.length - 6)).concat(["#", "#", "#", "#", "#", "#"]);
});
game.maps.upstairsHall.map[0][11] = "$1";
game.maps.upstairsHall.map[0][12] = "$1";
game.maps.upstairsHall.map[0][13] = "$1";

game.maps.upstairsHall.map[8][5] = "$2";
game.maps.upstairsHall.map[9][5] = "$2";
game.maps.upstairsHall.map[10][5] = "$2";

game.maps.parentsBedroom.map[0] = (function() {
  var a = [];
  for (var i = 0; i < 25; i++) {
    a.push("#");
  }
  return a;
})();
game.maps.parentsBedroom.map[18] = game.maps.parentsBedroom.map[0].slice(0);
game.maps.parentsBedroom.map = game.maps.parentsBedroom.map.map(function(e) {
  return ["#"].concat(e.slice(1, e.length - 1)).concat(["#"]);
});
game.maps.parentsBedroom.map[8][24] = "$1";
game.maps.parentsBedroom.map[9][24] = "$1";
game.maps.parentsBedroom.map[10][24] = "$1";

game.player.inv[0] = {
  id: 0x0001,
  mod: 0x1
};

game.main();
