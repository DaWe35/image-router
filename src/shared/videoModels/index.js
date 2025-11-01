import Veo2 from './google/veo-2.js'
import Veo2Mock from './google/veo-2-mock.js'
import Veo3 from './google/veo-3.js'
import Veo3Fast from './google/veo-3-fast.js'
import Veo31 from './google/veo-3.1.js'
import Veo31Fast from './google/veo-3.1-fast.js'

import Ltx2Pro from './lightricks/Ltx-2-Pro.js'
import Ltx2Fast from './lightricks/Ltx-2-Fast.js'

import Sora2 from './openai/sora-2.js'

import Kling16Standard from './kwaivgi/kling-1.6-standard.js'
import Kling21Standard from './kwaivgi/kling-2.1-standard.js'
import Kling21Pro from './kwaivgi/kling-2.1-pro.js'
import Kling21Master from './kwaivgi/kling-2.1-master.js'
import Kling25TurboPro from './kwaivgi/kling-2.5-turbo-pro.js'
import Kling25TurboStandard from './kwaivgi/kling-2.5-turbo-standard.js'

import Wan22 from './wan-ai/wan-2.2.js'
import Wan25 from './wan-ai/wan-2.5.js'

import Seedance1Lite from './bytedance/seedance-1-lite.js'
import Seedance1Pro from './bytedance/seedance-1-pro.js'
import Seedance1ProFast from './bytedance/seedance-1-pro-fast.js'

import Hailuo02Standard from './minimax/hailuo-02-standard.js'
import Hailuo02Pro from './minimax/hailuo-02-pro.js'
import Hailuo23 from './minimax/hailuo-2.3.js'
import Hailuo23Fast from './minimax/hailuo-2.3-fast.js'

import TestVideo from './test/test-video.js'

// Initialize all models
const modelInstances = [
  new Veo2(),
  new Veo3(),
  new Veo3Fast(),
  new Veo31(),
  new Veo31Fast(),
  //new Veo2Mock(),

  new Ltx2Pro(),
  new Ltx2Fast(),

  new Sora2(),

  new Kling16Standard(),
  new Kling21Standard(),
  new Kling21Pro(),
  new Kling21Master(),
  new Kling25TurboPro(),
  new Kling25TurboStandard(),

  new Wan22(),
  new Wan25(),

  new Seedance1Lite(),
  new Seedance1Pro(),
  new Seedance1ProFast(),

  new Hailuo02Standard(),
  new Hailuo02Pro(),
  new Hailuo23(),
  new Hailuo23Fast(),

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