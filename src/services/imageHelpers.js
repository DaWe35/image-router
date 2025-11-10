import { readFile } from 'fs/promises';
import sharp from 'sharp';

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
        minPixels, 
        maxPixels, 
        minDimension, 
        maxDimension,
        pixelStep = 1
    } = options;
    
    let image;

    if (typeof imageFile === 'string' && imageFile.startsWith('data:image')) {
        // Handle data URL
        const base64Data = imageFile.split(',')[1];
        const buffer = Buffer.from(base64Data, 'base64');
        image = sharp(buffer);
    } else if (Buffer.isBuffer(imageFile)) {
        // Handle Buffer
        image = sharp(imageFile);
    } else if (imageFile && typeof imageFile.arrayBuffer === 'function') { // Blob-like
        // Handle Blob
        const arrayBuffer = await imageFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        image = sharp(buffer);
    } else if (imageFile && imageFile.path) {
        // Handle file object from multer
        image = sharp(imageFile.path);
    } else {
        throw new Error('Unsupported image format provided to calculateRunwareDimensions');
    }
    
    const metadata = await image.metadata();
    const { width, height } = metadata;

    const aspectRatio = width / height;
    let newWidth = width;
    let newHeight = height;

    if (maxDimension !== undefined) {
        if (width > height) {
            newWidth = Math.min(maxDimension, width);
            newHeight = Math.round(newWidth / aspectRatio);
        } else {
            newHeight = Math.min(maxDimension, height);
            newWidth = Math.round(newHeight / aspectRatio);
        }
    }

    // Clamp to minimum size
    if (minDimension !== undefined) {
        if (newWidth < minDimension) {
            newWidth = minDimension;
            newHeight = Math.round(newWidth / aspectRatio);
        }
        if (newHeight < minDimension) {
            newHeight = minDimension;
            newWidth = Math.round(newHeight * aspectRatio);
        }
    }
    
    // Adjust for pixel constraints before rounding
    let totalPixels = newWidth * newHeight;
    if (maxPixels !== undefined && totalPixels > maxPixels) {
        const scaleFactor = Math.sqrt(maxPixels / totalPixels);
        newWidth = Math.floor(newWidth * scaleFactor);
        newHeight = Math.floor(newHeight * scaleFactor);
    }
    if (minPixels !== undefined && totalPixels < minPixels) {
        const scaleFactor = Math.sqrt(minPixels / totalPixels);
        newWidth = Math.ceil(newWidth * scaleFactor);
        newHeight = Math.ceil(newHeight * scaleFactor);
    }

    // Adjust dimensions to be multiples of pixelStep while preserving aspect ratio
    const originalWidth = newWidth;
    const originalHeight = newHeight;

    // Option 1: adjust width and derive height
    const w1 = Math.round(originalWidth / pixelStep) * pixelStep;
    const h1 = Math.round(w1 / aspectRatio);
    const h1_rounded = Math.round(h1 / pixelStep) * pixelStep;

    // Option 2: adjust height and derive width
    const h2 = Math.round(originalHeight / pixelStep) * pixelStep;
    const w2 = Math.round(h2 * aspectRatio);
    const w2_rounded = Math.round(w2 / pixelStep) * pixelStep;

    // Compare total pixel deviation from original
    const deviation1 = Math.abs(w1 * h1_rounded - originalWidth * originalHeight);
    const deviation2 = Math.abs(w2_rounded * h2 - originalWidth * originalHeight);

    if (deviation1 <= deviation2) {
        newWidth = w1;
        newHeight = h1_rounded;
    } else {
        newWidth = w2_rounded;
        newHeight = h2;
    }

    // After rounding, the total pixels might exceed maxPixels. Adjust if necessary.
    while (maxPixels !== undefined && newWidth * newHeight > maxPixels) {
        if (newWidth > newHeight) {
            newWidth -= pixelStep;
            newHeight = Math.round(newWidth / aspectRatio);
            newHeight = Math.round(newHeight / pixelStep) * pixelStep;
        } else {
            newHeight -= pixelStep;
            newWidth = Math.round(newHeight * aspectRatio);
            newWidth = Math.round(newWidth / pixelStep) * pixelStep;
        }
    }

    // Final check to ensure dimensions are within bounds
    if (maxDimension !== undefined) {
        if (newWidth > maxDimension || newHeight > maxDimension) {
            if (aspectRatio > 1) { // Landscape
                if (newWidth > maxDimension) {
                    newWidth = Math.round(maxDimension / pixelStep) * pixelStep;
                    newHeight = Math.round(newWidth / aspectRatio);
                    newHeight = Math.round(newHeight / pixelStep) * pixelStep;
                }
            } else { // Portrait or square
                if (newHeight > maxDimension) {
                    newHeight = Math.round(maxDimension / pixelStep) * pixelStep;
                    newWidth = Math.round(newHeight * aspectRatio);
                    newWidth = Math.round(newWidth / pixelStep) * pixelStep;
                }
            }
        }
    }


    return { width: newWidth, height: newHeight };
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
        return 1 // return 1 for safety, this should never happen
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

    // Accept forms like "1024x1024" or "512X768" (case-insensitive on the separator)
    const match = /^\s*(\d+)\s*[xX]\s*(\d+)\s*$/.exec(size)
    if (!match) {
        throw new Error("'size' must be in the format 'WIDTHxHEIGHT' (e.g. '1024x768')")
    }

    const width = parseInt(match[1], 10)
    const height = parseInt(match[2], 10)

    return { width, height }
}

