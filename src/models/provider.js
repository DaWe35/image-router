const { DataTypes } = require('sequelize')
const { sequelize } = require('./index')

const Provider = sequelize.define('Provider', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  apiKey: {
    type: DataTypes.STRING,
    allowNull: false
  },
  baseUrl: {
    type: DataTypes.STRING,
    allowNull: false
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  priority: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    validate: {
      min: 1
    }
  },
  rateLimit: {
    type: DataTypes.INTEGER,
    defaultValue: 60 // requests per minute
  },
  costPerImage: {
    type: DataTypes.DECIMAL(10, 6),
    allowNull: false
  },
  supportedSizes: {
    type: DataTypes.JSON,
    defaultValue: ['256x256', '512x512', '1024x1024']
  },
  maxImagesPerRequest: {
    type: DataTypes.INTEGER,
    defaultValue: 10
  },
  timeout: {
    type: DataTypes.INTEGER,
    defaultValue: 30000 // 30 seconds
  },
  metadata: {
    type: DataTypes.JSON
  }
})

module.exports = Provider 