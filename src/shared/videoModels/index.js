import Veo2 from './google/veo-2.js'
import Veo2Mock from './google/veo-2-mock.js'
import Veo3 from './google/veo-3.js'

import Kling16Standard from './kwaivgi/kling-1.6-standard.js'
import Seedance1Lite from './bytedance/seedance-1-lite.js'
import Seedance1Pro from './bytedance/seedance-1-pro.js'

import TestVideo from './test/test-video.js'

// Initialize all models
const modelInstances = [
  new Veo2(),
  new Veo3(),
  //new Veo2Mock(),

  new Kling16Standard(),

  new Seedance1Lite(),
  new Seedance1Pro(),

  new TestVideo(),
]

// Create an object with model IDs as keys
const videoModels = {}
modelInstances.forEach(instance => {
  const modelData = instance.getData()
  const modelId = modelData.id
  delete modelData.id
  
  // Add output type and feature support flags
  modelData.output = ["video"]
  modelData.supported_params = {
    quality: typeof modelData.providers[0]?.applyQuality === 'function',
    edit: typeof modelData.providers[0]?.applyImage === 'function',
    mask: typeof modelData.providers[0]?.applyMask === 'function'
  }
  
  videoModels[modelId] = modelData
})

export { videoModels } 