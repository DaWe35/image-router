import multer from 'multer'
import path from 'path'
import fs from 'fs/promises'

// Configure multer disk storage to /tmp with unique filenames
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, '/tmp')
    },
    filename: function(req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
    }
})

// Shared multer instance with 25 MB limit
export const upload = multer({
    storage,
    limits: {
        fileSize: 25 * 1024 * 1024 // 25MB max file size
    }
})

// Standardized multer error handler
export const handleMulterError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        return res.status(400).json({
            error: {
                message: `File upload error: ${err.message}`,
                type: 'invalid_request_error'
            }
        })
    }
    next(err)
}

// Factory producing a middleware which normalizes `field[]` -> `field`
export const normalizeUploadFilesFactory = (fieldNames = []) => {
    return (req, res, next) => {
        if (!req.files) return next()
        for (const name of fieldNames) {
            const arrayKey = `${name}[]`
            if (req.files[arrayKey] && !req.files[name]) {
                req.files[name] = req.files[arrayKey]
                delete req.files[arrayKey]
            }
        }
        next()
    }
}

// Automatically delete any files uploaded via Multer once the response is finished
export const cleanupUploadedFiles = (req, res, next) => {
    // Gather every file object Multer attached
    const uploadedFiles = []

    if (req.file) uploadedFiles.push(req.file)

    if (req.files) {
        Object.values(req.files).forEach(val => {
            if (Array.isArray(val)) uploadedFiles.push(...val)
            else if (val) uploadedFiles.push(val)
        })
    }

    // If no files -> nothing to clean up
    if (uploadedFiles.length === 0) return next()

    const deleteFiles = async () => {
        for (const file of uploadedFiles) {
            if (!file?.path) continue
            try {
                await fs.unlink(file.path)
            } catch (err) {
                // Silent fail – tmp cleaners or next reboot will remove leftovers
                console.error(`Failed to remove temp upload ${file.path}:`, err.message)
            }
        }
    }

    // Remove when the response has been completely sent or the connection is closed
    res.on('finish', deleteFiles)
    res.on('close', deleteFiles)

    next()
} 