import Imagen40606 from './imagen-4-06-06.js'

class Imagen4 extends Imagen40606 {
  constructor(...args) {
    super(...args)
    // overwrite the id inside the instance data so that callers see the generic id
    this.data.id = 'google/imagen-4'
  }
}

export default Imagen4