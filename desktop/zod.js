function zod(code) {
  var ns, i, line
  ns = {}
  code = code.split("\n")
  for (i = 0; i < code.length; i++) {
    line = code[i].split(" ")
    switch (line[0]) {
      case "SET": {
        break;
      }
    }
  }
}

zod.ins = {
  SET(ns, k, v) {
    ns[k] = v
  },
  MOV(ns, k1, k2) {
    ns[k1] = ns[k2]
  }
}
