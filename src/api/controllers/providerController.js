const { Provider } = require('../../models')
const { ApiError } = require('../../utils/errors')

const createProvider = async (req, res, next) => {
  try {
    const provider = await Provider.create(req.body)
    res.status(201).json({
      success: true,
      data: provider
    })
  } catch (error) {
    next(error)
  }
}

const listProviders = async (req, res, next) => {
  try {
    const providers = await Provider.findAll({
      order: [['priority', 'ASC']]
    })
    res.json({
      success: true,
      data: providers
    })
  } catch (error) {
    next(error)
  }
}

const getProvider = async (req, res, next) => {
  try {
    const provider = await Provider.findByPk(req.params.id)
    if (!provider) {
      throw new ApiError({
        statusCode: 404,
        type: 'not_found',
        message: 'Provider not found'
      })
    }
    res.json({
      success: true,
      data: provider
    })
  } catch (error) {
    next(error)
  }
}

const updateProvider = async (req, res, next) => {
  try {
    const provider = await Provider.findByPk(req.params.id)
    if (!provider) {
      throw new ApiError({
        statusCode: 404,
        type: 'not_found',
        message: 'Provider not found'
      })
    }
    await provider.update(req.body)
    res.json({
      success: true,
      data: provider
    })
  } catch (error) {
    next(error)
  }
}

const deleteProvider = async (req, res, next) => {
  try {
    const provider = await Provider.findByPk(req.params.id)
    if (!provider) {
      throw new ApiError({
        statusCode: 404,
        type: 'not_found',
        message: 'Provider not found'
      })
    }
    await provider.destroy()
    res.json({
      success: true,
      message: 'Provider deleted successfully'
    })
  } catch (error) {
    next(error)
  }
}

const updateProviderStatus = async (req, res, next) => {
  try {
    const provider = await Provider.findByPk(req.params.id)
    if (!provider) {
      throw new ApiError({
        statusCode: 404,
        type: 'not_found',
        message: 'Provider not found'
      })
    }
    await provider.update({ isActive: req.body.isActive })
    res.json({
      success: true,
      data: provider
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  createProvider,
  listProviders,
  getProvider,
  updateProvider,
  deleteProvider,
  updateProviderStatus
} 