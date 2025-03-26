const { DataTypes } = require('sequelize')
const { sequelize } = require('./index')
const crypto = require('crypto')

const ApiKey = sequelize.define('ApiKey', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  key: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  lastUsedAt: {
    type: DataTypes.DATE
  },
  expiresAt: {
    type: DataTypes.DATE
  },
  rateLimit: {
    type: DataTypes.INTEGER,
    defaultValue: 100
  },
  rateLimitWindow: {
    type: DataTypes.INTEGER,
    defaultValue: 900000 // 15 minutes in milliseconds
  }
}, {
  hooks: {
    beforeCreate: (apiKey) => {
      if (!apiKey.key) {
        apiKey.key = crypto.randomBytes(32).toString('hex')
      }
    }
  }
})

module.exports = ApiKey 