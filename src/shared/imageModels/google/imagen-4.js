import Imagen40606 from './imagen-4-06-06.js'

class Imagen4 extends Imagen40606 {
  constructor(...args) {
    super(...args)
    this.data.id = 'google/imagen-4'
    this.data.arena_score = 1106
    this.data.examples = [
      {
        image: '/model-examples/imagen-4.webp'
      }
    ]
  }
}

export default Imagen4