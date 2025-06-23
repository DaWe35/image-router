// Import all model classes
import Flux11Pro from './black-forest-labs/FLUX-1.1-pro.js'
import Flux1Schnell from './black-forest-labs/FLUX-1-schnell.js'
import Flux1SchnellFree from './black-forest-labs/FLUX-1-schnell-free.js'
import Flux1Dev from './black-forest-labs/FLUX-1-dev.js'
import FluxPro from './black-forest-labs/FLUX-pro.js'
import Flux11ProUltra from './black-forest-labs/flux-1.1-pro-ultra.js'
import FluxKontextPro from './black-forest-labs/flux-kontext-pro.js'
import FluxKontextMax from './black-forest-labs/flux-kontext-max.js' 

import Sd15Dpo from './stabilityai/sd1.5-dpo.js'
import Sd35Medium from './stabilityai/sd3.5-medium.js'
import Sd35 from './stabilityai/sd3.5.js'
import Sdxl from './stabilityai/sdxl.js'
import SdxlTurbo from './stabilityai/sdxl-turbo.js'
import SdxlTurboFree from './stabilityai/sdxl-turbo-free.js'
import Sd3 from './stabilityai/sd3.js'

import JuggernautFlux from './run-diffusion/Juggernaut-Flux.js'
import JuggernautLightningFlux from './run-diffusion/Juggernaut-Lightning-Flux.js'
import JuggernautProFlux from './run-diffusion/Juggernaut-Pro-Flux.js'
import JuggernautXL from './run-diffusion/Juggernaut-XL.js'
import RunDiffusionPhotoFlux from './run-diffusion/RunDiffusion-Photo-Flux.js'

import DallE2 from './openai/dall-e-2.js'
import DallE3 from './openai/dall-e-3.js'
import GptImage1 from './openai/gpt-image-1.js'

import RecraftV3 from './recraft-ai/recraft-v3.js'
import RecraftV3Svg from './recraft-ai/recraft-v3-svg.js'

import IdeogramV2a from './ideogram-ai/ideogram-v2a.js'
import IdeogramV2aTurbo from './ideogram-ai/ideogram-v2a-turbo.js'
import IdeogramV3Balanced from './ideogram-ai/ideogram-v3-balanced.js'
import IdeogramV3Turbo from './ideogram-ai/ideogram-v3-turbo.js'
import IdeogramV3Quality from './ideogram-ai/ideogram-v3-quality.js'
import IdeogramV3 from './ideogram-ai/ideogram-v3.js'

import Imagen3 from './google/imagen-3.js'
import Imagen3Fast from './google/imagen-3-fast.js'
import Imagen40520 from './google/imagen-4-05-20.js'
import Imagen4Ultra0520 from './google/imagen-4-05-20-ultra.js'
import Imagen40606 from './google/imagen-4-06-06.js'
import Imagen4Fast0606 from './google/imagen-4-06-06-fast.js'
import Imagen4Ultra0606 from './google/imagen-4-06-06-ultra.js'
import Imagen4 from './google/imagen-4.js'
import Imagen4Ultra from './google/imagen-4-ultra.js'
import imagen4Fast from './google/imagen-4-fast.js'
import Gemini20FlashExp from './google/gemini-2.0-flash-exp.js'
import Gemini20FlashExpFree from './google/gemini-2.0-flash-exp-free.js'
// Temporary disabled because of postCalcPrice function. Be careful! This model can generate multiple images.
// import Gemini20FlashPrev from './google/gemini-2.0-flash-prev.js'

import Photon from './luma/photon.js'
import PhotonFlash from './luma/photon-flash.js'

import Image01 from './minimax/image-01.js'

import TestImage from './test/test-image.js'

import DreamShaper from './runware/DreamShaper.js'
import RealisticVision from './runware/Realistic-Vision.js'
import RealVisXL from './runware/RealVisXL.js'
import HiDreamI1Fast from './hidream-ai/HiDream-I1-Fast.js'
import HiDreamI1Dev from './hidream-ai/HiDream-I1-Dev.js'
import HiDreamI1Full from './hidream-ai/HiDream-I1-Full.js'
import HiDreamI1Free from './hidream-ai/HiDream-I1-Full-free.js'

import SeedreamV3 from './bytedance/seedream-v3.js'
import InfiniteYou from './bytedance/infiniteyou.js'
import InfiniteYouFree from './bytedance/infiniteyou-free.js'
import Chroma from './lodestones/chroma.js'
import ChromaFree from './lodestones/chroma-free.js'

// Initialize all models
const modelInstances = [
  new Flux11Pro(),
  new Flux1Schnell(),
  new Flux1SchnellFree(),
  new Flux1Dev(),
  new FluxPro(),
  new Flux11ProUltra(),
  new FluxKontextPro(),
  new FluxKontextMax(),

  new Sd15Dpo(),
  new Sd35Medium(),
  new Sd35(),
  new Sdxl(),
  new SdxlTurbo(),
  new SdxlTurboFree(),
  new Sd3(),
  
  new JuggernautFlux(),
  new JuggernautLightningFlux(),
  new JuggernautProFlux(),
  new JuggernautXL(),
  new RunDiffusionPhotoFlux(),
  
  new DallE2(),
  new DallE3(),
  new GptImage1(),
  
  new RecraftV3(),
  new RecraftV3Svg(),
  
  new IdeogramV2a(),
  new IdeogramV2aTurbo(),
  new IdeogramV3Balanced(),
  new IdeogramV3Turbo(),
  new IdeogramV3Quality(),
  new IdeogramV3(),

  new Imagen3(),
  new Imagen3Fast(),
  new Imagen40520(),
  new Imagen4Ultra0520(),
  new Imagen40606(),
  new Imagen4Fast0606(),
  new Imagen4Ultra0606(),
  new Imagen4(),
  new Imagen4Ultra(),
  new imagen4Fast(),

  new Gemini20FlashExp(),
  new Gemini20FlashExpFree(),
  // new Gemini20FlashPrev(),
  
  new Photon(),
  new PhotonFlash(),
  
  new Image01(),

  new TestImage(),

  new DreamShaper(),
  new RealisticVision(),
  new RealVisXL(),
  new HiDreamI1Fast(),
  new HiDreamI1Dev(),
  new HiDreamI1Full(),
  
  new SeedreamV3(),
  new HiDreamI1Free(),
  new Chroma(),
  new ChromaFree(),
  new InfiniteYou(),
  new InfiniteYouFree(),
]

// Create an object with model IDs as keys
const imageModels = {}
modelInstances.forEach(instance => {
  const modelData = instance.getData()
  const modelId = modelData.id
  delete modelData.id
  
  // Add output type and feature support flags
  modelData.output = ["image"]
  modelData.supported_params = {
    quality: typeof modelData.providers[0]?.applyQuality === 'function',
    edit: typeof modelData.providers[0]?.applyImage === 'function',
    mask: typeof modelData.providers[0]?.applyMask === 'function'
  }
  
  imageModels[modelId] = modelData
})

export { imageModels } 