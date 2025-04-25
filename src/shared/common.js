// Arena score: https://artificialanalysis.ai/text-to-image/arena?tab=Leaderboard

const imageModels = {
    'black-forest-labs/FLUX-1.1-pro': {
        providers:['deepinfra'],
        price: 0.04,
        arenaScore: 1079,
        examples: [
            {
                image: '/model-examples/FLUX-1.1-pro.webp'
            }
        ]
    },
    'black-forest-labs/FLUX-1-schnell': {
        providers:['deepinfra'],
        price: 0.0005,
        arenaScore: 1000,
        examples: [
            {
                image: '/model-examples/FLUX-1-schnell.webp'
            }
        ]
    },
    'black-forest-labs/FLUX-1-schnell:free': {
        aliasOf: 'black-forest-labs/FLUX-1-schnell',
        providers:['deepinfra'],
        price: 0,
        arenaScore: 1000,
        examples: [
            {
                image: '/model-examples/FLUX-1-schnell.webp'
            }
        ]
    },
    'black-forest-labs/FLUX-1-dev': {
        providers:['deepinfra'],
        price: 0.009,
        arenaScore: 1042,
        examples: [
            {
                image: '/model-examples/FLUX-1-dev.webp'
            }
        ]
    },
    'black-forest-labs/FLUX-pro': {
        providers:['deepinfra'],
        price: 0.05,
        arenaScore: 1064,
        examples: [
            {
                image: '/model-examples/FLUX-pro-2025-04-03T14-14-55-833Z.webp'
            }
        ]
    },
    'stabilityai/sd3.5-medium': {
        providers:['deepinfra'],
        price: 0.03,
        arenaScore: 935,
        examples: [
            {
                image: '/model-examples/sd3.5-medium.webp'
            }
        ]
    },
    'run-diffusion/Juggernaut-Flux': {
        providers:['deepinfra'],
        price: 0.009,
        arenaScore: null,
        examples: [
            {
                image: '/model-examples/Juggernaut-Flux-2025-04-03T14-15-04-136Z.webp'
            }
        ]
    },
    'run-diffusion/Juggernaut-Lightning-Flux': {
        providers:['deepinfra'],
        price: 0.009,
        arenaScore: null,
        examples: [
            {
                image: '/model-examples/Juggernaut-Lightning-Flux-2025-04-03T14-15-05-487Z.webp'
            }
        ]
    },
    'openai/dall-e-2': {
        providers:['openai'],
		price: 0.016,
        arenaScore: 714,
        examples: [
            {
                image: '/model-examples/dall-e-2.webp'
            }
        ]
    },
    'openai/dall-e-3': {
        providers:['openai'],
		price: 0.08,
        arenaScore: 927,
        examples: [
            {
                image: '/model-examples/dall-e-3.webp'
            }
        ]
    },
    'openai/gpt-image-1': {
        // https://platform.openai.com/docs/guides/image-generation?image-generation-model=gpt-image-1
        // https://platform.openai.com/docs/models/gpt-image-1
        providers:['openai'],
        price: 'dynamic',
        priceExamples: {
            min: 0.011,
            average: 0.167,
            max: 0.5,
        },
        parameters: {
            quality: {
                default: "auto",
                values: ["auto", "low", "medium", "high"]
            },
            size: {
                default: "auto",
                values: ["auto", "1024x1024", "1024x1536", "1536x1024"]
            },
            /* background: {
                default: "auto",
                values: ["auto", "transparent", "opaque"]
            } */
        },
        arenaScore: 1156,
        examples: [
            {
                image: '/model-examples/gpt-image-1.webp'
            }
        ]
    },
    'stabilityai/sd3.5': {
        providers:['deepinfra'],
        price: 0.06,
        arenaScore: 1027,
        examples: [
            {
                image: '/model-examples/sd3.5.webp'
            }
        ]
    },
    'stabilityai/sdxl-turbo': {
        providers:['deepinfra'],
        price: 0.0002,
        arenaScore: 1030,
        examples: [
            {
                image: '/model-examples/sdxl-turbo.webp'
            }
        ]
    },
    'stabilityai/sdxl-turbo:free': {
        aliasOf: 'stabilityai/sdxl-turbo',
        providers:['deepinfra'],
        price: 0,
        arenaScore: 1030,
        examples: [
            {
                image: '/model-examples/sdxl-turbo.webp'
            }
        ]
    },
    'recraft-ai/recraft-v3': {
        providers:['replicate'],
        price: 0.04,
        arenaScore: 1105,
        examples: [
            {
                image: '/model-examples/recraft-v3-2025-04-03T15-09-40-800Z.webp'
            }
        ]
    },
    'ideogram-ai/ideogram-v2a-turbo': {
        providers:['replicate'],
        price: 0.025,
        arenaScore: 991,
        examples: [
            {
                image: '/model-examples/ideogram-v2a-turbo-2025-04-03T15-10-09-820Z.webp'
            }
        ]
    },
    'ideogram-ai/ideogram-v2a': {
        providers:['replicate'],
        price: 0.04,
        arenaScore: 997,
        examples: [
            {
                image: '/model-examples/ideogram-v2a-2025-04-03T15-10-14-620Z.webp'
            }
        ]
    },
    'google/imagen-3': {
        providers:['replicate'],
        price: 0.05,
        arenaScore: 1084,
        examples: [
            {
                image: '/model-examples/imagen-3-2025-04-03T15-11-15-706Z.webp'
            }
        ]
    },
    'google/imagen-3-fast': {
        providers:['replicate'],
        price: 0.025,
        arenaScore: null,
        examples: [
            {
                image: '/model-examples/imagen-3-fast-2025-04-03T15-11-16-597Z.webp'
            }
        ]
    },
    'black-forest-labs/flux-1.1-pro-ultra': {
        providers:['replicate'],
        price: 0.06,
        arenaScore: null,
        examples: [
            {
                image: '/model-examples/flux-1.1-pro-ultra-2025-04-03T15-49-06-132Z.webp'
            }
        ]
    },
    'luma/photon': {
        providers:['replicate'],
        price: 0.03,
        arenaScore: 1031,
        examples: [
            {
                image: '/model-examples/photon-2025-04-03T15-07-51-501Z.webp'
            }
        ]
    },
    'luma/photon-flash': {
        providers:['replicate'],
        price: 0.01,
        arenaScore: 964,
        examples: [
            {
                image: '/model-examples/photon-flash-2025-04-03T14-22-54-572Z.webp'
            }
        ]
    },
    'recraft-ai/recraft-v3-svg': {
        providers:['replicate'],
        price: 0.08,
        arenaScore: null,
        examples: [
            {
                image: '/model-examples/recraft-v3-svg-2025-04-03T15-34-40-865Z.svg'
            }
        ]
    },
    'minimax/image-01': {
        providers:['replicate'],
        price: 0.01,
        arenaScore: 1044,
        examples: [
            {
                image: '/model-examples/image-01.webp'
            }
        ]
    },
    'stability-ai/stable-diffusion-3.5-large': {
        providers:['replicate'],
        price: 0.065,
        arenaScore: 1027,
        examples: [
            {
                image: '/model-examples/stable-diffusion-3.5-large.webp'
            }
        ]
    },
    'stability-ai/stable-diffusion-3.5-large-turbo': {
        providers:['replicate'],
        price: 0.04,
        arenaScore: 1030,
        examples: [
            {
                image: '/model-examples/stable-diffusion-3.5-large-turbo.webp'
            }
        ]
    },
    'google/gemini-2.0-flash-exp': {
        aliasOf: 'google/gemini-2.0-flash-exp-image-generation',
        providers:['google'],
        price: 0.01,
        arenaScore: 966,
        examples: [
            {
                image: '/model-examples/gemini-2.0-flash-exp_free-2025-04-07T22-34-11-327Z.webp'
            }
        ]
    },
    'google/gemini-2.0-flash-exp:free': {
        aliasOf: 'google/gemini-2.0-flash-exp-image-generation',
        providers:['google'],
        price: 0,
        arenaScore: 966,
        examples: [
            {
                image: '/model-examples/gemini-2.0-flash-exp_free-2025-04-07T22-34-11-327Z.webp'
            }
        ]
    },
}

export { imageModels }