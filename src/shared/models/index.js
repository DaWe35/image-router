// Import all model classes
import Flux11Pro from './black-forest-labs/FLUX-1.1-pro.js'
import Flux1Schnell from './black-forest-labs/FLUX-1-schnell.js'
import Flux1SchnellFree from './black-forest-labs/FLUX-1-schnell-free.js'
import Flux1Dev from './black-forest-labs/FLUX-1-dev.js'
import FluxPro from './black-forest-labs/FLUX-pro.js'
import Flux11ProUltra from './black-forest-labs/flux-1.1-pro-ultra.js'

import Sd35Medium from './stabilityai/sd3.5-medium.js'
import Sd35 from './stabilityai/sd3.5.js'
import SdxlTurbo from './stabilityai/sdxl-turbo.js'
import SdxlTurboFree from './stabilityai/sdxl-turbo-free.js'

import JuggernautFlux from './run-diffusion/Juggernaut-Flux.js'
import JuggernautLightningFlux from './run-diffusion/Juggernaut-Lightning-Flux.js'

import DallE2 from './openai/dall-e-2.js'
import DallE3 from './openai/dall-e-3.js'
import GptImage1 from './openai/gpt-image-1.js'

import RecraftV3 from './recraft-ai/recraft-v3.js'
import RecraftV3Svg from './recraft-ai/recraft-v3-svg.js'

import IdeogramV2aTurbo from './ideogram-ai/ideogram-v2a-turbo.js'
import IdeogramV2a from './ideogram-ai/ideogram-v2a.js'

import Imagen3 from './google/imagen-3.js'
import Imagen3Fast from './google/imagen-3-fast.js'
import Gemini20FlashExp from './google/gemini-2.0-flash-exp.js'
import Gemini20FlashExpFree from './google/gemini-2.0-flash-exp-free.js'

import Photon from './luma/photon.js'
import PhotonFlash from './luma/photon-flash.js'

import Image01 from './minimax/image-01.js'

import TestImage from './test/test-image.js'
// Initialize all models
const modelInstances = [
  new Flux11Pro(),
  new Flux1Schnell(),
  new Flux1SchnellFree(),
  new Flux1Dev(),
  new FluxPro(),
  new Flux11ProUltra(),
  
  new Sd35Medium(),
  new Sd35(),
  new SdxlTurbo(),
  new SdxlTurboFree(),
  
  new JuggernautFlux(),
  new JuggernautLightningFlux(),
  
  new DallE2(),
  new DallE3(),
  new GptImage1(),
  
  new RecraftV3(),
  new RecraftV3Svg(),
  
  new IdeogramV2aTurbo(),
  new IdeogramV2a(),
  
  new Imagen3(),
  new Imagen3Fast(),
  new Gemini20FlashExp(),
  new Gemini20FlashExpFree(),
  
  new Photon(),
  new PhotonFlash(),
  
  new Image01(),

  new TestImage(),
]

// Create an object with model IDs as keys
const models = {}
modelInstances.forEach(instance => {
  const modelData = instance.getData()
  const modelId = modelData.id
  delete modelData.id
  
  // Add feature support flags
  modelData.supported_params = {
    quality: typeof modelData.providers[0]?.applyQuality === 'function',
    image: typeof modelData.providers[0]?.applyImage === 'function',
    mask: typeof modelData.providers[0]?.applyMask === 'function'
  }
  
  models[modelId] = modelData
})

export { models } 