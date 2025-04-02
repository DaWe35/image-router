const imageModels = {
    'openai/dall-e-2': {
        providers:['openai'],
		price: 0.02,
        examples: [
            {
                prompt: '',
                image: ''
            }
        ]
    },
    'openai/dall-e-3': {
        providers:['openai'],
		price: 0.12,
        examples: [
            {
                prompt: '',
                image: ''
            }
        ]
    },
    'stabilityai/sd3.5': {
        providers:['deepinfra'],
        price: 0.06,
        examples: [
            {
                prompt: '',
                image: ''
            }
        ]
    },
    'black-forest-labs/FLUX-1.1-pro': {
        providers:['deepinfra'],
        price: 0.04
    },
    'black-forest-labs/FLUX-1-schnell': {
        providers:['deepinfra'],
        price: 0.0005
    },
    'black-forest-labs/FLUX-1-schnell:free': {
        aliasOf: 'black-forest-labs/FLUX-1-schnell',
        providers:['deepinfra'],
        price: 0
    },
    'black-forest-labs/FLUX-1-dev': {
        providers:['deepinfra'],
        price: 0.009
    },
    'black-forest-labs/FLUX-pro': {
        providers:['deepinfra'],
        price: 0.05
    },
    'stabilityai/sd3.5-medium': {
        providers:['deepinfra'],
        price: 0.03
    },
    'black-forest-labs/FLUX-1-Redux-dev': {
        providers:['deepinfra'],
        price: 0.012
    },
    'run-diffusion/Juggernaut-Flux': {
        providers:['deepinfra'],
        price: 0.009
    },
    'run-diffusion/Juggernaut-Lightning-Flux': {
        providers:['deepinfra'],
        price: 0.009
    },
    'stabilityai/sdxl-turbo': {
        providers:['deepinfra'],
        price: 0.0002
    },
    'stabilityai/sdxl-turbo:free': {
        aliasOf: 'stabilityai/sdxl-turbo',
        providers:['deepinfra'],
        price: 0
    },
    'recraft-ai/recraft-v3': {
        providers:['replicate'],
        price: 0.04
    },
    'ideogram-ai/ideogram-v2a-turbo': {
        providers:['replicate'],
        price: 0.025
    },
    'ideogram-ai/ideogram-v2a': {
        providers:['replicate'],
        price: 0.04
    },
    'google/imagen-3': {
        providers:['replicate'],
        price: 0.05
    },
    'google/imagen-3-fast': {
        providers:['replicate'],
        price: 0.025
    },
    'black-forest-labs/flux-1.1-pro-ultra': {
        providers:['replicate'],
        price: 0.06
    },
    'luma/photon': {
        providers:['replicate'],
        price: 0.03
    },
    'luma/photon-flash': {
        providers:['replicate'],
        price: 0.01
    },
    'recraft-ai/recraft-v3-svg': {
        providers:['replicate'],
        price: 0.08
    },
    'minimax/image-01': {
        providers:['replicate'],
        price: 0.01
    },
    'stability-ai/stable-diffusion-3.5-large': {
        providers:['replicate'],
        price: 0.065
    },
    'stability-ai/stable-diffusion-3.5-large-turbo': {
        providers:['replicate'],
        price: 0.04
    }
}

export { imageModels }