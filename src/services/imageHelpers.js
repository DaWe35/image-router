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

// Helper function to convert file to Blob
function bufferToBlob(buffer, mimetype) {
    return new Blob([buffer], { type: mimetype })
}

// Utility function to process image files
export function processSingleOrMultipleFiles(imageFiles) {
    if (Array.isArray(imageFiles)) {
        return processMultipleFiles(imageFiles)
    } else {
        return processSingleFile(imageFiles)
    }
}

export function processSingleFile(file) {
    return {
        blob: bufferToBlob(file.buffer, file.mimetype),
        filename: file.originalname
    }
}

export function processMultipleFiles(files) {
    return files.map(file => processSingleFile(file))
}