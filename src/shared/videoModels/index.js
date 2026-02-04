import Veo2 from './google/veo-2.js'
import Veo2Mock from './google/veo-2-mock.js'
import Veo3 from './google/veo-3.js'
import Veo3Fast from './google/veo-3-fast.js'
import Veo31 from './google/veo-3.1.js'
import Veo31Fast from './google/veo-3.1-fast.js'

import Ltx2Pro from './lightricks/Ltx-2-Pro.js'
import Ltx2Fast from './lightricks/Ltx-2-Fast.js'
import Ltx2 from './lightricks/Ltx-2.js'

import Sora2 from './openai/sora-2.js'
import Sora2Pro from './openai/sora-2-pro.js'

import HunyuanVideo15 from './tencent/hunyuan-video-1.5.js'

import Kling16Standard from './kling/kling-1.6-standard.js'
import Kling21Standard from './kling/kling-2.1-standard.js'
import Kling21Pro from './kling/kling-2.1-pro.js'
import Kling21Master from './kling/kling-2.1-master.js'
import Kling25TurboPro from './kling/kling-2.5-turbo-pro.js'
import Kling25TurboStandard from './kling/kling-2.5-turbo-standard.js'

import Wan22 from './wan-ai/wan-2.2.js'
import Wan25 from './wan-ai/wan-2.5.js'
import Wan26 from './wan-ai/wan-2.6.js'

import Seedance1Lite from './bytedance/seedance-1-lite.js'
import Seedance1Pro from './bytedance/seedance-1-pro.js'
import Seedance1ProFast from './bytedance/seedance-1-pro-fast.js'
import Seedance15Pro from './bytedance/seedance-1.5-pro.js'

import Hailuo02Standard from './minimax/hailuo-02-standard.js'
import Hailuo02Pro from './minimax/hailuo-02-pro.js'
import Hailuo23 from './minimax/hailuo-2.3.js'
import Hailuo23Fast from './minimax/hailuo-2.3-fast.js'

import GrokImagineVideo from './xAI/grok-imagine-video.js'

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
  new Ltx2(),

  new Sora2(),
  new Sora2Pro(),

  new Kling16Standard(),
  new Kling21Standard(),
  new Kling21Pro(),
  new Kling21Master(),
  new Kling25TurboPro(),
  new Kling25TurboStandard(),

  new Wan22(),
  new Wan25(),
  new Wan26(),
  
  new Seedance1Lite(),
  new Seedance1Pro(),
  new Seedance1ProFast(),
  new Seedance15Pro(),

  new HunyuanVideo15(),

  new Hailuo02Standard(),
  new Hailuo02Pro(),
  new Hailuo23(),
  new Hailuo23Fast(),

  new GrokImagineVideo(),

  new TestVideo(),
]

// Create an object with model IDs as keys
const videoModels = {}
modelInstances.forEach(instance => {
  const modelData = instance.getData()
  const modelId = modelData.id
  delete modelData.id
  
  // Add output type and feature support flags
  modelData.inputs = {
    image: typeof modelData.providers[0]?.applyImage === 'function',
    mask: typeof modelData.providers[0]?.applyMask === 'function',
    quality: typeof modelData.providers[0]?.applyQuality === 'function',
    size: modelData.sizes ?? ['custom'],
    seconds: modelData.seconds ?? ['auto']
  }
  modelData.output = ["video"]
  
  videoModels[modelId] = modelData
})

export { videoModels } 