const sequelize = require('../config/database')

// Import models
const User = require('./user')
const ApiKey = require('./apiKey')
const ImageRequest = require('./imageRequest')
const Provider = require('./provider')

// Define associations
User.hasMany(ApiKey)
ApiKey.belongsTo(User)

User.hasMany(ImageRequest)
ImageRequest.belongsTo(User)

Provider.hasMany(ImageRequest)
ImageRequest.belongsTo(Provider)

module.exports = {
  sequelize,
  User,
  ApiKey,
  ImageRequest,
  Provider
} 