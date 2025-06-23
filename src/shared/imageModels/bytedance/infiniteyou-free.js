import InfiniteYou from '../bytedance/infiniteyou.js'

class InfiniteYouFree extends InfiniteYou {
  constructor(...args) {
    super(...args)
    this.data.id = 'ByteDance/InfiniteYou:free'
    this.data.providers[0].pricing.value = 0
  }
}

export default InfiniteYouFree