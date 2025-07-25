import Veo2 from './google/veo-2.js'
import Veo2Mock from './google/veo-2-mock.js'
import Veo3 from './google/veo-3.js'
import Veo3Fast from './google/veo-3-fast.js'

import Kling16Standard from './kwaivgi/kling-1.6-standard.js'
import Kling21Standard from './kwaivgi/kling-2.1-standard.js'
import Kling21Pro from './kwaivgi/kling-2.1-pro.js'
import Kling21Master from './kwaivgi/kling-2.1-master.js'
import Seedance1Lite from './bytedance/seedance-1-lite.js'
import Seedance1Pro from './bytedance/seedance-1-pro.js'

import Hailuo02Standard from './minimax/hailuo-02-standard.js'
import Hailuo02Pro from './minimax/hailuo-02-pro.js'

import TestVideo from './test/test-video.js'

// Initialize all models
const modelInstances = [
  new Veo2(),
  new Veo3(),
  new Veo3Fast(),
  //new Veo2Mock(),

  new Kling16Standard(),
  new Kling21Standard(),
  new Kling21Pro(),
  new Kling21Master(),

  new Seedance1Lite(),
  new Seedance1Pro(),

  new Hailuo02Standard(),
  new Hailuo02Pro(),

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