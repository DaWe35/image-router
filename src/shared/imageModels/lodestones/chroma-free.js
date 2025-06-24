import Chroma from '../lodestones/chroma.js'

class ChromaFree extends Chroma {
  constructor(...args) {
    super(...args)
    this.data.id = 'lodestones/Chroma:free'
    this.data.providers[0].pricing.value = 0
  }
}

export default ChromaFree