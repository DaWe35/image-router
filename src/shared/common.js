const imageModels = {
    'openai/dall-e-2': {
        providers:['openai'],
		price: 0.02
        
    },
    'openai/dall-e-3': {
        providers:['openai'],
		price: 0.12
    },
    'stabilityai/sd3.5': {
        providers:['deepinfra'],
        price: 0.06
    },
    'black-forest-labs/FLUX-1.1-pro': {
        providers:['deepinfra'],
        price: 0.04
    },
    'black-forest-labs/FLUX-1-schnell': {
        providers:['deepinfra'],
        price: 0.1
    },
    'black-forest-labs/FLUX-1-dev': {
        providers:['deepinfra'],
        price: 0.072
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
        price: 0.096
    },
    'run-diffusion/Juggernaut-Flux': {
        providers:['deepinfra'],
        price: 0.072
    },
    'run-diffusion/Juggernaut-Lightning-Flux': {
        providers:['deepinfra'],
        price: 0.072
    },
    'stabilityai/sdxl-turbo': {
        providers:['deepinfra'],
        price: 0.0016
    },
}

export { imageModels }