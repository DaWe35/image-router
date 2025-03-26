const { DataTypes } = require('sequelize')
const { sequelize } = require('./index')

const ImageRequest = sequelize.define('ImageRequest', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  prompt: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  size: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [['256x256', '512x512', '1024x1024']]
    }
  },
  n: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    validate: {
      min: 1,
      max: 10
    }
  },
  status: {
    type: DataTypes.ENUM('pending', 'processing', 'completed', 'failed'),
    defaultValue: 'pending'
  },
  error: {
    type: DataTypes.TEXT
  },
  providerRequestId: {
    type: DataTypes.STRING
  },
  providerResponse: {
    type: DataTypes.JSON
  },
  cost: {
    type: DataTypes.DECIMAL(10, 6)
  },
  duration: {
    type: DataTypes.INTEGER // Duration in milliseconds
  },
  metadata: {
    type: DataTypes.JSON
  }
})

module.exports = ImageRequest 