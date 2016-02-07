var zod = {};
zod.exec = function(code) {
  /*
    registers:
      A 000 accumulator
      C 001 carry
      F 010 flags
      M 011 memory
      P 100 program
      S 101 stack
      Y 110 free
      Z 111 free
  */
};

zod.assemble = function(code) {
  var assembled = [];
  var flag = 0;
  code = code.split("\n");
  code.forEach(function(line) {
    var out = [];
    line = line.split(" ");
    switch (line[0]) {
      case "RL": flag = 0x08; // register = literal
      case "RM": {
        switch (line[1]) {
          case "A":
            out.push(0x00 + flag);
            break;
          case "C":
            out.push(0x01 + flag);
            break;
          case "F":
            out.push(0x02 + flag);
            break;
          case "M":
            out.push(0x03 + flag);
            break;
          case "P":
            out.push(0x04 + flag);
            break;
          case "S":
            out.push(0x05 + flag);
            break;
          case "Y":
            out.push(0x06 + flag);
            break;
          case "Z":
            out.push(0x07 + flag);
            break;
        }
        out.push(line[2] | 0);
      }
      case "ML":
      case "MM": {
        out.concat(line.slice(1).map(n => n | 0));
        break;
      }
    }
    
  });
};
