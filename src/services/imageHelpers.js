import { readFile } from 'fs/promises';
import sharp from 'sharp';
import { videoModels } from '../shared/videoModels/index.js'

// Helper function to convert an object to FormData
export function objectToFormData(obj) {
    const formData = new FormData()
    
    Object.entries(obj).forEach(([key, value]) => {
        if (value === undefined || value === null) return
        
        // Handle file uploads (image or mask)
        if ((key === 'image' || key === 'mask') && value) {
            if (Array.isArray(value) && key === 'image') {
                // Handle multiple images
                value.forEach(item => {
                    if (item.blob && item.filename) {
                        formData.append(`${key}[]`, item.blob, item.filename)
                    }
                })
            } else if (value.blob && value.filename) {
                // Handle single file
                formData.append(key, value.blob, value.filename)
            }
        } else {
            // For all other fields
            formData.append(key, value)
        }
    })
    
    return formData
}

// Function to calculate image dimensions for Runware models
export async function calculateRunwareDimensions(imageFile, options = {}) {
    const {
        minPixels = 1,
        maxPixels = Infinity,
        minDimension = 1,
        maxDimension = Infinity,
        pixelStep = 1
    } = options;

    let image;
    if (typeof imageFile === 'string' && imageFile.startsWith('data:image')) {
        const base64Data = imageFile.split(',')[1];
        const buffer = Buffer.from(base64Data, 'base64');
        image = sharp(buffer);
    } else if (Buffer.isBuffer(imageFile)) {
        image = sharp(imageFile);
    } else if (imageFile && typeof imageFile.arrayBuffer === 'function') { // Blob-like
        const arrayBuffer = await imageFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        image = sharp(buffer);
    } else if (imageFile && imageFile.path) {
        image = sharp(imageFile.path);
    } else {
        throw new Error('Unsupported image format provided to calculateRunwareDimensions');
    }
    
    const metadata = await image.metadata();
    const { width, height } = metadata;
    const aspectRatio = width / height;

    let newWidth = width;
    let newHeight = height;

    // Scale down if dimensions exceed maxDimension
    if (newWidth > maxDimension || newHeight > maxDimension) {
        if (aspectRatio >= 1) { // Landscape or square
            newWidth = maxDimension;
            newHeight = Math.round(newWidth / aspectRatio);
        } else { // Portrait
            newHeight = maxDimension;
            newWidth = Math.round(newHeight * aspectRatio);
        }
    }

    // Scale up if dimensions are less than minDimension
    if (newWidth < minDimension || newHeight < minDimension) {
        if (aspectRatio >= 1) { // Landscape or square
            newHeight = minDimension;
            newWidth = Math.round(newHeight * aspectRatio);
        } else { // Portrait
            newWidth = minDimension;
            newHeight = Math.round(newWidth / aspectRatio);
        }
    }

    // Adjust for pixel constraints
    let totalPixels = newWidth * newHeight;
    if (totalPixels > maxPixels) {
        const scaleFactor = Math.sqrt(maxPixels / totalPixels);
        newWidth = Math.floor(newWidth * scaleFactor);
        newHeight = Math.floor(newHeight * scaleFactor);
    } else if (totalPixels < minPixels) {
        const scaleFactor = Math.sqrt(minPixels / totalPixels);
        newWidth = Math.ceil(newWidth * scaleFactor);
        newHeight = Math.ceil(newHeight * scaleFactor);
    }

    // Adjust dimensions to be multiples of pixelStep
    newWidth = Math.round(newWidth / pixelStep) * pixelStep;
    newHeight = Math.round(newHeight / pixelStep) * pixelStep;

    // Final check to ensure total pixels does not exceed maxPixels after rounding
    while (newWidth * newHeight > maxPixels) {
        if (newWidth * newHeight > 1.01 * maxPixels) { // Big deviation, scale proportionally
            const scaleFactor = Math.sqrt(maxPixels / (newWidth * newHeight));
            newWidth = Math.floor(newWidth * scaleFactor / pixelStep) * pixelStep;
            newHeight = Math.floor(newHeight * scaleFactor / pixelStep) * pixelStep;
        } else { // Small deviation, nudge down
            if (newWidth >= newHeight) {
                newWidth -= pixelStep;
            } else {
                newHeight -= pixelStep;
            }
        }
    }

    return { width: Math.max(pixelStep, newWidth), height: Math.max(pixelStep, newHeight) };
}

// Utility function to process image files
export async function processSingleOrMultipleFiles(imageFiles, format = 'blob') {
    if (Array.isArray(imageFiles)) {
        return processMultipleFiles(imageFiles, format)
    } else {
        return processSingleFile(imageFiles, format)
    }
}

export async function processSingleFile(file, format = 'blob') {
    if (Array.isArray(file) && file.length > 1) {
        throw new Error('This model supports only one image input')
    }
    const actualFile = Array.isArray(file) ? file[0] : file
    const buffer = await readFile(actualFile.path);

    if (format === 'blob') {
        return {
            blob: new Blob([buffer], { type: actualFile.mimetype }),
            filename: actualFile.originalname
        }
    } else if (format === 'datauri') {
        const mimeType = file.mimetype || 'image/png'
        const base64 = buffer.toString('base64')
        return `data:${mimeType};base64,${base64}`
    } else if (format === 'base64') {
        return buffer.toString('base64')
    } else {
        throw new Error(`Invalid image processing format '${format}'`)
    }
}

export async function processMultipleFiles(files, format = 'blob') {
    return await Promise.all(files.map(file => processSingleFile(file, format)))
}

// Function to get Google Gemini API key based on model and environment variables
export function getGeminiApiKey(model) {
    const geminiKeyString = process.env.GOOGLE_GEMINI_API_KEY
    let geminiKeyArray = []
    
    if (geminiKeyString) {
      geminiKeyArray = geminiKeyString.split(',').filter(key => key.trim() !== '')
    }
    
    // Make sure we have at least one key
    if (!geminiKeyArray.length) {
      throw new Error('No Google Gemini API key found')
    }
    
    // Use random API key for free models; use the first key for paid models
    if (model === 'gemini-2.0-flash-exp-image-generation' && geminiKeyArray.length > 1) {
        return geminiKeyArray[Math.floor(Math.random() * geminiKeyArray.length)]
    } else {
        return geminiKeyArray[0]
    }
}

export function postCalcSimple(imageResult) {
    try {
        // just return the cost, it's already in the result
        return imageResult.cost
    } catch (error) {
        console.error('Error calculating Runware price:', error)
        return 10 // return 10 for safety, this should never happen
    }
}

export function postCalcNanoGPTDiscounted10(imageResult) {
    try {
        // just return 110% of the cost, since NanoGPT is discounted by 10%
        return imageResult.cost * 1.1
    } catch (error) {
        console.error('Error calculating NanoGPT price:', error)
        return 1 // return 1 for safety, this should never happen
    }
}

export function postCalcNanoGPTDiscounted5(imageResult) {
    try {
        // just return 110% of the cost, since NanoGPT is discounted by 10%
        return imageResult.cost * 1.05
    } catch (error) {
        console.error('Error calculating NanoGPT price:', error)
        return 1 // return 1 for safety, this should never happen
    }
}

// Function to extract width and height from a size string (e.g. "1024x1024")
// Returns an object with numeric `width` and `height` properties. If the
// provided value is the special keyword 'auto', both values will be null.
// Throws if the format is invalid.
export function extractWidthHeight(size) {
    if (size === undefined || size === null || size === 'auto') {
        return { width: null, height: null }
    }

    // Accept forms like "1024x1024", "512X768", "1024×1024" or "1024*1024"
    const match = /^\s*(\d+)\s*[xX×*]\s*(\d+)\s*$/.exec(size)
    if (!match) {
        throw new Error("'size' must be in the format 'WIDTHxHEIGHT' (e.g. '1024x768')")
    }

    const width = parseInt(match[1], 10)
    const height = parseInt(match[2], 10)

    return { width, height }
}

// Gemini size mappings - shared between generateGemini and generateVertexGemini
export const sizeToAspectRatio = {
    // Gemini 2.5 Flash sizes
    '1024x1024': '1:1',
    '832x1248': '2:3',
    '1248x832': '3:2',
    '864x1184': '3:4',
    '1184x864': '4:3',
    '896x1152': '4:5',
    '1152x896': '5:4',
    '768x1344': '9:16',
    '1344x768': '16:9',
    '1536x672': '21:9',
    // Gemini 3 Pro 1K sizes
    '848x1264': '2:3',
    '1264x848': '3:2',
    '896x1200': '3:4',
    '1200x896': '4:3',
    '928x1152': '4:5',
    '1152x928': '5:4',
    '768x1376': '9:16',
    '1376x768': '16:9',
    '1584x672': '21:9',
    // Gemini 3 Pro 2K sizes
    '2048x2048': '1:1',
    '1696x2528': '2:3',
    '2528x1696': '3:2',
    '1792x2400': '3:4',
    '2400x1792': '4:3',
    '1856x2304': '4:5',
    '2304x1856': '5:4',
    '1536x2752': '9:16',
    '2752x1536': '16:9',
    '3168x1344': '21:9',
    // Gemini 3 Pro 4K sizes
    '4096x4096': '1:1',
    '3392x5056': '2:3',
    '5056x3392': '3:2',
    '3584x4800': '3:4',
    '4800x3584': '4:3',
    '3712x4608': '4:5',
    '4608x3712': '5:4',
    '3072x5504': '9:16',
    '5504x3072': '16:9',
    '6336x2688': '21:9',
    // Video sizes (Veo and other video models)
    '1280x720': '16:9',
    '720x1280': '9:16',
    '1080x1080': '1:1',
    '1920x1080': '16:9',
    '1080x1920': '9:16',
};

// Map size to imageSize for Gemini 3 Pro (1K, 2K, 4K)
export const sizeToImageSize = {
    // 1K resolution
    '1024x1024': '1K',
    '848x1264': '1K',
    '1264x848': '1K',
    '896x1200': '1K',
    '1200x896': '1K',
    '928x1152': '1K',
    '1152x928': '1K',
    '768x1376': '1K',
    '1376x768': '1K',
    '1584x672': '1K',
    // 2K resolution
    '2048x2048': '2K',
    '1696x2528': '2K',
    '2528x1696': '2K',
    '1792x2400': '2K',
    '2400x1792': '2K',
    '1856x2304': '2K',
    '2304x1856': '2K',
    '1536x2752': '2K',
    '2752x1536': '2K',
    '3168x1344': '2K',
    // 4K resolution
    '4096x4096': '4K',
    '3392x5056': '4K',
    '5056x3392': '4K',
    '3584x4800': '4K',
    '4800x3584': '4K',
    '3712x4608': '4K',
    '4608x3712': '4K',
    '3072x5504': '4K',
    '5504x3072': '4K',
    '6336x2688': '4K',
};


export function resolveSeconds(requestedSeconds, modelName) {
    const modelConfig = videoModels[modelName]
    if (!modelConfig) {
        throw new Error(`Model '${modelName}' not found`)
    }
    if (requestedSeconds == null || requestedSeconds === 'auto') return modelConfig.default_seconds
    const parsed = Number(requestedSeconds)
    const isValid = Number.isFinite(parsed) && parsed > 0 && modelConfig.seconds?.includes(parsed)
    return isValid ? parsed : modelConfig.default_seconds
}

// Video pricing: calculate price based on actual seconds
export function calcVideoPrice(params, pricePerSecond) {
    try {
        const seconds = resolveSeconds(params.seconds, params.model)
        return pricePerSecond * seconds
    } catch (error) {
        console.error('Error calculating video price:', error)
        return 10 // return 1 for safety, this should never happen
    }
}