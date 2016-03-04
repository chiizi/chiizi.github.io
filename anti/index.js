{
  const make = p => c =>
    Object.seal(Object.assign(Object.assign({}, p), c || {}))
} // weird stuff

const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d")

const xyz = make({
  x: 0,
  y: 0,
  z: 0,
  add(c) {
    this.x += c.x
    this.y += c.y
    this.z += c.z
    return this
  }
})

const color = function(c) {
  const c = c || 0
  const a = 255 - (c / 0x01000000 & 0xFF)
  const r = c >> 0x10 & 0xFF
  const g = c >> 0x08 & 0xFF
  const b = c >> 0x00 & 0xFF
  const string = `rgba(${r}, ${g}, ${b}, ${a / 255})`
  
  return Object.freeze({
    r, g, b, a, string, c
  })
}

const point = make({
  p: xyz(),
  v: xyz(),
  a: xyz(),
  j: xyz(),
  color: color(0x00880000),
  step: function(time) {
    this.p.add(this.v.add(this.a.add(this.j)))
  }
})
const projPt = function(p, c) {
  var x, y
  
  return [x, y]
}

{
  var then = Date.now()
  const update = function() {
    const now = Date.now()
    const mod = now - then / 1000
    then = now
  }
  const draw = function() {
    
  }
  const main = function() {
    requestAnimationFrame(main)
    update()
    render()
  }
} // main stuff
