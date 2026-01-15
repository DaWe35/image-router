// Import all model classes
import Flux11Pro from './black-forest-labs/FLUX-1.1-pro.js'
import Flux1Schnell from './black-forest-labs/FLUX-1-schnell.js'
import Flux1SchnellFree from './black-forest-labs/FLUX-1-schnell-free.js'
import Flux1Dev from './black-forest-labs/FLUX-1-dev.js'
import FluxPro from './black-forest-labs/FLUX-pro.js'
import Flux11ProUltra from './black-forest-labs/flux-1.1-pro-ultra.js'
import FluxKontextPro from './black-forest-labs/flux-kontext-pro.js'
import FluxKontextMax from './black-forest-labs/flux-kontext-max.js'
import FluxKontextDev from './black-forest-labs/flux-kontext-dev.js'
import FluxKreaDev from './black-forest-labs/flux-krea-dev.js'
import Flux2Dev from './black-forest-labs/FLUX-2-dev.js'
import Flux2Pro from './black-forest-labs/FLUX-2-pro.js'
import Flux2Flex from './black-forest-labs/FLUX-2-flex.js'
import Flux2Max from './black-forest-labs/FLUX-2-max.js'
import Flux2DevTurbo from './runware/Flux-2-Dev-Turbo.js'
import Flux2Klein4b from './black-forest-labs/FLUX-2-klein-4b.js'
import Flux2Klein4bBase from './black-forest-labs/FLUX-2-klein-4b-base.js'
import Flux2Klein9bBase from './black-forest-labs/FLUX-2-klein-9b-base.js'

import BlurBackground from './bria/Blur-Background.js'
import BlurBackgroundFree from './bria/Blur-Background-Free.js'
import Bria32Vector from './bria/Bria-3.2-Vector.js'
import Bria32VectorFree from './bria/Bria-3.2-Vector-Free.js'
import Bria32 from './bria/Bria-3.2.js'
import Bria32Free from './bria/Bria-3.2-Free.js'
import BriaFibo from './bria/Bria-Fibo.js'
import Enhance from './bria/Enhance.js'
import EnhanceFree from './bria/Enhance-Free.js'
import EraseForeground from './bria/Erase-Foreground.js'
import EraseForegroundFree from './bria/Erase-Foreground-Free.js'
import Erase from './bria/Erase.js'
import Expand from './bria/Expand.js'
import GenFill from './bria/Gen-Fill.js'
import RemoveBackground from './bria/Remove-Background.js'
import RemoveBackgroundFree from './bria/Remove-Background-Free.js'
import ReplaceBackground from './bria/Replace-Background.js'

import Sd15Dpo from './stabilityai/sd1.5-dpo.js'
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
import GptImage1Mini from './openai/gpt-image-1-mini.js'
import GptImage15 from './openai/gpt-image-1.5.js'
import GptImage15Free from './openai/gpt-image-1.5-free.js'

import RecraftV3 from './recraft-ai/recraft-v3.js'
import RecraftV3Svg from './recraft-ai/recraft-v3-svg.js'
import RecraftVectorize from './recraft-ai/recraft-vectorize.js'

import Reve1 from './reve/reve-1.js'

import IdeogramV2a from './ideogram-ai/ideogram-v2a.js'
import IdeogramV2aTurbo from './ideogram-ai/ideogram-v2a-turbo.js'
import IdeogramV3Balanced from './ideogram-ai/ideogram-v3-balanced.js'
import IdeogramV3Turbo from './ideogram-ai/ideogram-v3-turbo.js'
import IdeogramV3Quality from './ideogram-ai/ideogram-v3-quality.js'
import IdeogramV3 from './ideogram-ai/ideogram-v3.js'

import LucidOrigin from './leonardo/lucid-origin.js'

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
import Gemini25Flash from './google/gemini-2.5-flash.js'
import Gemini3Pro from './google/gemini-3-pro.js'

import Photon from './luma/photon.js'
import PhotonFlash from './luma/photon-flash.js'

import Midjourney from './midjourney/midjourney.js'

import Image01 from './minimax/image-01.js'

import TestImage from './test/test-image.js'

import ZImageTurbo from './tongyi-mai/Z-Image-Turbo.js'
import ZImageTurboFree from './tongyi-mai/Z-Image-Turbo-FREE.js'

import AnimagineXL from './runware/Animagine.js'
import CyberRealisticPony from './runware/CyberRealistic-Pony.js'
import DreamShaper from './runware/DreamShaper.js'
import Ghibli from './runware/Ghibli.js'
import IllustriousXL from './runware/Illustrious-XL.js'
import PonyDiffusionV6XL from './runware/Pony-Diffusion-V6-XL.js'
import RealisticVision from './runware/Realistic-Vision.js'
import RealVisXL from './runware/RealVisXL.js'
import HiDreamI1Fast from './hidream-ai/HiDream-I1-Fast.js'
import HiDreamI1Dev from './hidream-ai/HiDream-I1-Dev.js'
import HiDreamI1Full from './hidream-ai/HiDream-I1-Full.js'
import HiDreamI1Free from './hidream-ai/HiDream-I1-Full-free.js'
import HidreamE11 from './hidream-ai/hidream-e1-1.js'
import Riverflow1 from './runware/Riverflow-1.js'
import Riverflow1Mini from './runware/Riverflow-1-mini.js'
import ImagineArt15 from './runware/imagineart-1.5.js'
import ImagineArt15Pro from './runware/imagineart-1.5-pro.js'
import PImage10 from './runware/P-Image-1.0.js'

import SeedreamV3 from './bytedance/seedream-v3.js'
import SeedEditV3 from './bytedance/seededit-v3.js'
import SeedreamV4 from './bytedance/seedream-v4.js'
import SeedreamV45 from './bytedance/seedream-v4.5.js'
import InfiniteYou from './bytedance/infiniteyou.js'
import InfiniteYouFree from './bytedance/infiniteyou-free.js'
import Chroma from './lodestones/chroma.js'
import ChromaFree from './lodestones/chroma-free.js'
import DreaminaV31 from './bytedance/dreamina-3.1.js'

import QwenImage from './qwen/qwen-image.js'
import QwenImageFree from './qwen/qwen-image-free.js'
import QwenImageEdit from './qwen/qwen-image-edit.js'
import QwenImageEditPlus from './qwen/qwen-image-edit-plus.js'
import Ovis7B from './qwen/ovis-7b.js'
import QwenImageLayered from './qwen/qwen-image-layered.js'
import QwenImage2512 from './qwen/qwen-image-2512.js'
import QwenImageEdit2511 from './qwen/qwen-image-edit-2511.js'

import Grok2Image from './xAI/grok-2-image.js'

import SwinIR from './upscale/SwinIR.js'
import CCSR from './upscale/CCSR.js'
import SDLatent from './upscale/SD-Latent.js'
import Clarity from './upscale/Clarity.js'

import HunyuanImage3 from './tencent/hunyuan-image-3.js'

import GlmImage from './zai/GLM-Image.js'

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
  new FluxKontextDev(),
  new FluxKreaDev(),
  new Flux2Dev(),
  new Flux2Pro(),
  new Flux2Flex(),
  new Flux2Max(),
  new Flux2DevTurbo(),
  new Flux2Klein4b(),
  new Flux2Klein4bBase(),
  new Flux2Klein9bBase(),

  new BlurBackground(),
  new BlurBackgroundFree(),
  new Bria32Vector(),
  new Bria32VectorFree(),
  new Bria32(),
  new Bria32Free(),
  new BriaFibo(),
  new Enhance(),
  new EnhanceFree(),
  new EraseForeground(),
  new EraseForegroundFree(),
  //new Erase(),
  //new Expand(),
  //new GenFill(),
  new RemoveBackground(),
  new RemoveBackgroundFree(),
  //new ReplaceBackground(),
  
  new Sd15Dpo(),
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
  new GptImage1Mini(),
  new GptImage15Free(),
  new GptImage15(),
  
  new RecraftV3(),
  new RecraftV3Svg(),
  new RecraftVectorize(),
  
  new Reve1(),
  
  new IdeogramV2a(),
  new IdeogramV2aTurbo(),
  new IdeogramV3Balanced(),
  new IdeogramV3Turbo(),
  new IdeogramV3Quality(),
  new IdeogramV3(),

  new LucidOrigin(),

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

  new Gemini25Flash(),
  new Gemini3Pro(),
  
  new Photon(),
  new PhotonFlash(),
  
  new Midjourney(),
  
  new Image01(),

  new TestImage(),

  new ZImageTurbo(),
  new ZImageTurboFree(),

  new AnimagineXL(),
  new CyberRealisticPony(),
  new DreamShaper(),
  new Ghibli(),
  new IllustriousXL(),
  new PonyDiffusionV6XL(),
  new RealisticVision(),
  new RealVisXL(),
  new HiDreamI1Fast(),
  new HiDreamI1Dev(),
  new HiDreamI1Full(),
  new HidreamE11(),
  new Riverflow1(),
  new Riverflow1Mini(),
  new ImagineArt15(),
  new ImagineArt15Pro(),
  new PImage10(),
  
  new SeedreamV3(),
  new SeedEditV3(),
  new SeedreamV4(),
  new SeedreamV45(),
  new HiDreamI1Free(),
  new Chroma(),
  new ChromaFree(),
  new InfiniteYou(),
  new InfiniteYouFree(),
  new DreaminaV31(),

  new QwenImage(),
  new QwenImageFree(),
  new QwenImageEdit(),
  new QwenImageEditPlus(),
  new Ovis7B(),
  new QwenImageLayered(),
  new QwenImage2512(),
  new QwenImageEdit2511(),

  new Grok2Image(),

  new SwinIR(),
  new CCSR(),
  new SDLatent(),
  new Clarity(),

  new HunyuanImage3(),

  new GlmImage(),
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