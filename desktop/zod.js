/*
  registers:
  A - arithmetic
  C - conditional
  M - mem ptr
  Z - special
  
  each instruction is 32 bits long
  first 8 bits are for opcode
  
  opcodes:
  00-0F: misc
    00 .. .. ..: NOP
    01 xx xx ..: goto xxxx
    09 xx xx ..: goto mem[xxxx]
  10-1F: math
    10 xx .. ..: A += xx
    11 xx .. ..: A -= xx
    12 xx .. ..: A *= xx
    13 xx .. ..: A /= xx
    14 xx .. ..: A %= xx
    18 xx .. ..: A += mem[xxxx]
    19 xx .. ..: A -= mem[xxxx]
    1A xx .. ..: A *= mem[xxxx]
    1B xx .. ..: A /= mem[xxxx]
    1C xx .. ..: A %= mem[xxxx]
  20-2F: bitwise
    20 xx .. ..: A &= xx
    21 xx .. ..: A ^= xx
    22 xx .. ..: A |= xx
    23..: A = ~A
    28 xx xx ..: A &= mem[xxxx]
    29 xx xx ..: A ^= mem[xxxx] 
    2A xx xx ..: A |= mem[xxxx]
  30-3F: io
    30 xx .. ..: output xx 
    38 xx xx ..: output mem[xxxx]
  40-4F: mem
    48 xx xx yy: mem[xxxx] = yy
  50-5F: registers
    50 0v .. ..:
      v > 7: set flag v - 8
      v < 8: clear flag v
    51 xx .. ..:
      A = xx
    58 xx xx ..:
      mem[xxxx] > 7: set flag mem[xxxx] - 8
      mem[xxxx] < 8: clear flag mem[xxxx]
    59 xx xx ..:
      A = mem[xxxx]
*/


var zod = out =>
  function(code) {
    var i = -1;
    var out = "";
    var op = 0;
    var A = 0;
    var C = 0;
    var M = 0;
    var Z = 0;
    var mem = new Int8Array(65536);
    while (i < code.length) {
      op = code[i][0];
      switch (op) {
        case 0x00:
          break;
        case 0x01:
          i = (code[i][1] << 8) + code[i][2] - 1;
          break;
        case 0x09:
          i = (mem[(code[i][1] << 8) + code[i][2]] << 8) + mem[(code[i][1] << 8) + code[i][2] + 1] - 1;
          break;
        case 0x10:
          A += code[i][1];
          break;
        case 0x11:
          A -= code[i][1];
          break;
        case 0x12:
          A *= code[i][1];
          break;
        case 0x13:
          A /= code[i][1];
          break;
        case 0x14:
          A %= code[i][1];
          break;
        case 0x18:
          A += mem[(code[i][1] << 8) + code[i][2]];
          break;
        case 0x19:
          A -= mem[(code[i][1] << 8) + code[i][2]];
          break;
        case 0x1A:
          A *= mem[(code[i][1] << 8) + code[i][2]];
          break;
        case 0x1B:
          A /= mem[(code[i][1] << 8) + code[i][2]];
          break;
        case 0x1C:
          A %= mem[(code[i][1] << 8) + code[i][2]];
          break;
        case 0x20:
          A &= code[i][1];
          break;
        case 0x21:
          A ^= code[i][1];;
          break;
        case 0x22:
          A |= code[i][1];
          break;
        case 0x23:
          A = ~A;
          break;
        case 0x28:
          A &= mem[(code[i][1] << 8) + code[i][2]];
          break;
        case 0x29:
          A ^= mem[(code[i][1] << 8) + code[i][2]];
          break;
        case 0x2A:
          A |= mem[(code[i][1] << 8) + code[i][2]];
          break;
        case 0x30:
          out += String.fromCharCode(code[i][1]);
          break;
        case 0x38:
          out += String.fromCharCode(mem[(code[i][1] << 8) + code[i][2]]);
          break;
        case 0x48:
          mem[(code[i][1] << 8) + code[i][2]] = code[i][3];
          break;
        case 0x50:
          if (code[i][1] < 8)
            
          else
            
  50-5F: registers
    50 0v .. ..:
      v > 7: set flag v - 8
      v < 8: clear flag v
    51 xx .. ..:
      A = xx
    52 xx .. ..:
      C = xx
    53 xx .. ..:
      M = xx
    54 xx xx ..:
      mem[xxxx] = Z;
    58 xx xx ..:
      mem[xxxx] > 7: set flag mem[xxxx] - 8
      mem[xxxx] < 8: clear flag mem[xxxx]
    59 xx xx ..:
      A = mem[xxxx]
      }
      i++;
    }
  };
