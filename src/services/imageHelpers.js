import { readFile } from 'fs/promises';
import { createCanvas, loadImage } from 'canvas';
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

// Utility function to process image files
export async function processSingleOrMultipleFiles(imageFiles) {
    if (Array.isArray(imageFiles)) {
        return processMultipleFiles(imageFiles)
    } else {
        return processSingleFile(imageFiles)
    }
}

export async function processSingleFile(file) {
    if (Array.isArray(file) && file.length > 1) {
        throw new Error('This model supports only one image input')
    }
    const actualFile = Array.isArray(file) ? file[0] : file
    const buffer = await readFile(actualFile.path);

    return {
        blob: new Blob([buffer], { type: actualFile.mimetype }),
        filename: actualFile.originalname
    }
}

export async function processMultipleFiles(files) {
    return await Promise.all(files.map(file => processSingleFile(file)))
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

// Helper function to calculate resize dimensions maintaining aspect ratio
function calculateResizeDimensions(originalWidth, originalHeight, maxSize = 1024) {
    const aspectRatio = originalWidth / originalHeight
    
    if (originalWidth > originalHeight) {
        // Landscape orientation
        const newWidth = Math.min(originalWidth, maxSize)
        const newHeight = Math.round(newWidth / aspectRatio)
        return { width: newWidth, height: newHeight }
    } else {
        // Portrait or square orientation
        const newHeight = Math.min(originalHeight, maxSize)
        const newWidth = Math.round(newHeight * aspectRatio)
        return { width: newWidth, height: newHeight }
    }
}

// Function to merge multiple images into a single image
export async function mergeImages(imageFiles) {
    if (!Array.isArray(imageFiles) || imageFiles.length === 0) {
        throw new Error('No images to merge')
    }
    
    if (imageFiles.length === 1) {
        // If only one image, just process it normally but resize to max 1024
        const file = imageFiles[0]
        const buffer = await readFile(file.path)
        
        // Resize the single image to max 1024 resolution
        const resizedBuffer = await sharp(file.path)
            .resize(1024, 1024, { 
                fit: 'inside',
                withoutEnlargement: true 
            })
            .png()
            .toBuffer()
        
        return {
            blob: new Blob([resizedBuffer], { type: 'image/png' }),
            filename: file.originalname
        }
    }
    
    // Load and resize all images using sharp for preprocessing and canvas for final processing
    const images = []
    for (const file of imageFiles) {
        console.log(`Processing image: ${file.originalname}, path: ${file.path}, mimetype: ${file.mimetype}`)
        
        try {
            // Resize all images to exactly 1024x1024 to eliminate whitespace
            // This will crop/stretch images to fit perfectly
            const pngBuffer = await sharp(file.path)
                .resize(1024, 1024, { 
                    fit: 'cover',  // This will crop to fill the entire 1024x1024 space
                    position: 'center'
                })
                .png()
                .toBuffer()
            
            console.log(`Resized and converted ${file.originalname} to 1024x1024 PNG using sharp`)
            
            // Load the PNG buffer with canvas
            const image = await loadImage(pngBuffer)
            console.log(`Successfully loaded converted image: ${file.originalname}`)
            images.push(image)
            
        } catch (error) {
            console.error(`Failed to process image ${file.originalname}:`, error.message)
            throw new Error(`Unable to process image: ${file.originalname}. ${error.message}`)
        }
    }
    
    // Calculate dimensions for the merged image
    // We'll arrange images in a grid layout
    const cols = Math.ceil(Math.sqrt(images.length))
    const rows = Math.ceil(images.length / cols)
    
    // Since all images are now exactly 1024x1024, no whitespace between them
    const cellSize = 1024
    
    const canvasWidth = cellSize * cols
    const canvasHeight = cellSize * rows
    
    // Create canvas and context
    const canvas = createCanvas(canvasWidth, canvasHeight)
    const ctx = canvas.getContext('2d')
    
    // Fill background with white
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, canvasWidth, canvasHeight)
    
    // Draw images in grid layout - no centering needed since all are 1024x1024
    images.forEach((image, index) => {
        const col = index % cols
        const row = Math.floor(index / cols)
        
        const x = col * cellSize
        const y = row * cellSize
        
        ctx.drawImage(image, x, y)
    })
    
    // Convert canvas to buffer
    const buffer = canvas.toBuffer('image/png')
    
    return {
        blob: new Blob([buffer], { type: 'image/png' }),
        filename: 'merged_image.png'
    }
}
