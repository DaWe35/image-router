import { processSingleFile, processSingleOrMultipleFiles } from '../services/imageHelpers.js'

// Image helpers

export async function applyImageSingle(params) {
    params.image = await processSingleFile(params.files.image, 'blob')
    delete params.files.image
    return params
}

export async function applyReferenceImages(params) {
    params.referenceImages = await processSingleOrMultipleFiles(params.files.image, 'datauri')
    delete params.files.image
    return params
}

export async function applySingleInputImage(params) {
    params.inputImage = await processSingleFile(params.files.image, 'datauri')
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