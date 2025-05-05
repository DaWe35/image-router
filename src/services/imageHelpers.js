import { readFile } from 'fs/promises';

// Helper function to convert an object to FormData
export function objectToFormData(obj) {
    const formData = new FormData()
    
    Object.entries(obj).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            // Special handling for image files (can be multiple)
            if (key === 'image') {
                if (Array.isArray(value)) {
                    // Handle multiple images
                    value.forEach(item => {
                        if (item.blob && item.filename) {
                            formData.append(`${key}[]`, item.blob, item.filename)
                        }
                    })
                } else if (value.blob && value.filename) {
                    // Handle single image
                    formData.append(key, value.blob, value.filename)
                }
            } 
            // Special handling for mask file (always single)
            else if (key === 'mask' && value.blob && value.filename) {
                formData.append(key, value.blob, value.filename)
            }
            // For all other fields, handle normally
            else {
                formData.append(key, value)
            }
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
    const buffer = await readFile(file.path);
    return {
        blob: new Blob([buffer], { type: file.mimetype }),
        filename: file.originalname
    }
}

export async function processMultipleFiles(files) {
    return await Promise.all(files.map(file => processSingleFile(file)))
}