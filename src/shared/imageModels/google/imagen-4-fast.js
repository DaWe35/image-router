import Imagen4Fast0606 from './imagen-4-06-06-fast.js'

class Imagen4Fast extends Imagen4Fast0606 {
  constructor(...args) {
    super(...args)
    this.data.id = 'google/imagen-4-fast'
    this.data.arena_score = 1079
  }
}

export default Imagen4Fast