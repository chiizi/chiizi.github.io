const item = (name, sprites, kind, ...elements) => ({name, sprites, kind, elements})
const tile = (draw, o = {}) => Object.assign({draw}, o)
