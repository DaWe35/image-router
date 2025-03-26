const imageService = require('../../services/imageService')
const { ApiError } = require('../../utils/errors')

const generateImage = async (req, res, next) => {
  try {
    const result = await imageService.generateImage(
      req.user.id,
      req.apiKey.id,
      req.body.prompt,
      {
        n: req.body.n,
        size: req.body.size,
        response_format: req.body.response_format
      }
    )

    res.json({
      success: true,
      data: result
    })
  } catch (error) {
    next(error)
  }
}

const getImageStatus = async (req, res, next) => {
  try {
    const result = await imageService.getImageStatus(req.params.id, req.user.id)
    res.json({
      success: true,
      data: result
    })
  } catch (error) {
    next(error)
  }
}

const listImages = async (req, res, next) => {
  try {
    const result = await imageService.listImages(req.user.id, {
      limit: parseInt(req.query.limit) || 10,
      offset: parseInt(req.query.offset) || 0,
      status: req.query.status
    })

    res.json({
      success: true,
      data: result
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  generateImage,
  getImageStatus,
  listImages
} 