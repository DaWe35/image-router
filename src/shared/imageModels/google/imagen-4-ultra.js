import Imagen4Ultra0606 from './imagen-4-06-06-ultra.js'

class Imagen4Ultra extends Imagen4Ultra0606 {
  constructor(...args) {
    super(...args)
    this.data.id = 'google/imagen-4-ultra'
  }
}

export default Imagen4Ultra