import { processSingleFile, processSingleOrMultipleFiles } from '../services/helpers.js'

// Image helpers

export async function applyImageSingle(params) {
    params.image = await processSingleFile(params.files.image, 'blob')
    delete params.files.image
    return params
}

export async function applyImageSingleBase64(params) {
    const file = Array.isArray(params.files.image) ? params.files.image[0] : params.files.image
    const base64 = await processSingleFile(params.files.image, 'base64')
    params.image = {
        base64,
        mimeType: file.mimetype || 'image/png'
    }
    delete params.files.image
    return params
}

export async function applyReferenceImagesBase64(params) {
    // same as applyImageSingleBase64 but allows multiple images
    const files = Array.isArray(params.files.image) ? params.files.image : [params.files.image]
    const base64Results = await processSingleOrMultipleFiles(params.files.image, 'base64')
    const base64Array = Array.isArray(base64Results) ? base64Results : [base64Results]
    
    params.referenceImages64 = base64Array.map((base64, index) => ({
        base64,
        mimeType: files[index].mimetype || 'image/png'
    }))
    
    delete params.files.image
    return params
}

export async function applyImageSingleDataURI(params) {
    params.image = await processSingleFile(params.files.image, 'datauri')
    delete params.files.image
    return params
}

export async function applyReferenceImages(params) {
    params.referenceImages = await processSingleOrMultipleFiles(params.files.image, 'datauri')
    delete params.files.image
    return params
}

export async function applyReferenceImages1024x1024(params) {
    params.referenceImages = await processSingleOrMultipleFiles(params.files.image, 'datauri')
    delete params.files.image
    if (!params.size || params.size === 'auto') {
        params.size = '1024x1024'
    }
    return params
}

export async function applySingleInputImage(params) {
    params.inputImage = await processSingleFile(params.files.image, 'datauri')
    delete params.files.image
    return params
}

export async function applyImagesReferences1024x1024(params) {
    params.inputs_references = await processSingleOrMultipleFiles(params.files.image, 'datauri')
    delete params.files.image
    if (!params.size || params.size === 'auto') {
        params.size = '1024x1024'
    }
    return params
}

export async function applyInputImagesReferences(params) {
    params.inputs_referenceImages = await processSingleOrMultipleFiles(params.files.image, 'datauri')
    delete params.files.image
    return params
}

export async function applyFalImage(params) {
    params.image_url = await processSingleFile(params.files.image, 'datauri')
    // Determine the correct model path – if an image_url is provided switch to image-to-image variant
    if (params.model.includes('/text-to-image')) {
        params.model = params.model.replace('/text-to-image', '/image-to-image')
    }
    delete params.files.image
    return params
}

export async function applyVertexImage(params) {
    params.image_url = await processSingleFile(params.files.image, 'datauri')
    delete params.files.image
    return params
}

export async function applyImageNanoGPT(params) {
    params.image = await processSingleOrMultipleFiles(params.files.image, 'datauri')
    delete params.files.image
    return params
}

// Video helpers

export async function applyImageRunwareVideo(params) {
    params.image = await processSingleOrMultipleFiles(params.files.image, 'datauri')
    delete params.files.image
    return params
}

export function applyAccelerationRunware(params) {
    if (params.quality === 'low') {
        params.acceleration = 'high'
    } else if (params.quality === 'high') {
        params.acceleration = 'low'
    } else {
        params.acceleration = 'medium'
    }
    return params
}