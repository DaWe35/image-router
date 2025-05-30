import Veo2 from './google/veo-2.js'
import Veo2Mock from './google/veo-2-mock.js'
import Veo3 from './google/veo-3.js'
import TestVideo from './test/test-video.js'
import Wan21T2V14B from './wan-ai/Wan2.1-T2V-14B.js'
import Wan21T2V1B from './wan-ai/Wan2.1-T2V-1.3B.js'

// Initialize all models
const modelInstances = [
  new Veo2(),
  //new Veo3(),
  //new Veo2Mock(),
  new TestVideo(),
  new Wan21T2V14B(),
  new Wan21T2V1B(),
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