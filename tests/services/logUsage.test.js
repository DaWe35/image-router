import { preLogUsage, refundUsage, postLogUsage } from '../../src/services/logUsage.js'
import { models } from '../../src/shared/models/index.js'
import { prisma } from '../../src/config/database.js'
import { preCalcPrice, postCalcPrice, convertPriceToDbFormat } from '../../src/shared/priceCalculator.js'

// Mock dependencies
jest.mock('../../src/shared/models/index.js', () => ({
  models: {
    'test-paid-model': {
      providers: [{ id: 'test-provider' }]
    },
    'test-free-model': {
      providers: [{ id: 'test-free-provider' }]
    }
  }
}))

jest.mock('../../src/config/database.js', () => ({
  prisma: {
    $transaction: jest.fn(callback => callback({
      user: {
        update: jest.fn().mockResolvedValue({})
      },
      APIUsage: {
        create: jest.fn().mockResolvedValue({
          id: 'test-usage-id',
          cost: 5000
        }),
        update: jest.fn().mockResolvedValue({})
      }
    }))
  }
}))

jest.mock('../../src/shared/priceCalculator.js', () => {
  const mock = {
    preCalcPrice: jest.fn(),
    postCalcPrice: jest.fn(),
    convertPriceToDbFormat: jest.fn(price => price * 10000)
  }
  
  // Return 0 for free model, 0.5 for paid model
  mock.preCalcPrice.mockImplementation((model) => {
    return model === 'test-free-model' ? 0 : 0.5
  })
  
  // Return 0 for free model, 0.3 for paid model
  mock.postCalcPrice.mockImplementation((model) => {
    return model === 'test-free-model' ? 0 : 0.3
  })
  
  return mock
})

describe('logUsage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('preLogUsage with paid model', () => {
    it('should log usage and deduct credits', async () => {
      const params = {
        prompt: 'Test prompt',
        model: 'test-paid-model'
      }
      
      const apiKey = {
        id: 'test-api-key',
        apiKeyTempJwt: false,
        user: {
          id: 'test-user-id',
          credits: 10000, // 1 USD
          isActive: true
        }
      }

      const result = await preLogUsage(params, apiKey)
      
      // Verify price calculation
      expect(preCalcPrice).toHaveBeenCalledWith('test-paid-model', undefined, undefined)
      expect(convertPriceToDbFormat).toHaveBeenCalledWith(0.5)
      
      // Verify transaction was called
      expect(prisma.$transaction).toHaveBeenCalled()
      
      // Verify the result is the created usage entry
      expect(result).toEqual({
        id: 'test-usage-id',
        cost: 5000
      })
    })

    it('should throw error if user has insufficient credits', async () => {
      const params = {
        prompt: 'Test prompt',
        model: 'test-paid-model'
      }
      
      const apiKey = {
        id: 'test-api-key',
        user: {
          id: 'test-user-id',
          credits: 0, // No credits
          isActive: true
        }
      }

      await expect(preLogUsage(params, apiKey)).rejects.toThrow('Insufficient credits')
    })
  })
  
  describe('preLogUsage with free model', () => {
    it('should allow users with 0 credits to use free models', async () => {
      const params = {
        prompt: 'Test prompt',
        model: 'test-free-model' // Free model
      }
      
      const apiKey = {
        id: 'test-api-key',
        apiKeyTempJwt: false,
        user: {
          id: 'test-user-id',
          credits: 0, // No credits
          isActive: true
        }
      }
      
      // Override mock for this specific test to return 0 cost
      prisma.$transaction.mockImplementationOnce(callback => 
        callback({
          user: {
            update: jest.fn().mockResolvedValue({})
          },
          APIUsage: {
            create: jest.fn().mockResolvedValue({
              id: 'test-usage-id',
              cost: 0
            }),
            update: jest.fn().mockResolvedValue({})
          }
        })
      )

      const result = await preLogUsage(params, apiKey)
      
      // Verify price calculation returns 0 for free model
      expect(preCalcPrice).toHaveBeenCalledWith('test-free-model', undefined, undefined)
      expect(convertPriceToDbFormat).toHaveBeenCalledWith(0)
      
      // Verify transaction was called
      expect(prisma.$transaction).toHaveBeenCalled()
      
      // Verify the result is the created usage entry with 0 cost
      expect(result).toEqual({
        id: 'test-usage-id',
        cost: 0
      })
    })
  })

  describe('refundUsage', () => {
    it('should refund credits and update usage entry', async () => {
      const apiKey = {
        user: {
          id: 'test-user-id'
        }
      }
      
      const usageLogEntry = {
        id: 'test-usage-id',
        cost: 5000
      }
      
      const errorToLog = 'Test error'

      await refundUsage(apiKey, usageLogEntry, errorToLog)
      
      // Verify transaction was called
      expect(prisma.$transaction).toHaveBeenCalled()
      
      // Verify the transaction functions were called with correct parameters
      const transactionMock = prisma.$transaction.mock.calls[0][0]
      const transactionObj = { 
        user: { update: jest.fn() }, 
        APIUsage: { update: jest.fn() } 
      }
      
      await transactionMock(transactionObj)
      
      expect(transactionObj.user.update).toHaveBeenCalledWith({
        where: { id: 'test-user-id' },
        data: { credits: { increment: 5000 } }
      })
      
      expect(transactionObj.APIUsage.update).toHaveBeenCalledWith({
        where: { id: 'test-usage-id' },
        data: {
          status: 'error',
          error: 'Test error',
          cost: 0
        }
      })
    })
    
    it('should handle refund for free models without incrementing credits', async () => {
      const apiKey = {
        user: {
          id: 'test-user-id'
        }
      }
      
      const usageLogEntry = {
        id: 'test-usage-id',
        cost: 0 // Free model with 0 cost
      }
      
      const errorToLog = 'Test error'

      await refundUsage(apiKey, usageLogEntry, errorToLog)
      
      // Verify transaction was called
      expect(prisma.$transaction).toHaveBeenCalled()
      
      // Verify the transaction functions were called with correct parameters
      const transactionMock = prisma.$transaction.mock.calls[0][0]
      const transactionObj = { 
        user: { update: jest.fn() }, 
        APIUsage: { update: jest.fn() } 
      }
      
      await transactionMock(transactionObj)
      
      // Should not increment credits if cost was 0
      expect(transactionObj.user.update).toHaveBeenCalledWith({
        where: { id: 'test-user-id' },
        data: { credits: { increment: 0 } }
      })
      
      expect(transactionObj.APIUsage.update).toHaveBeenCalledWith({
        where: { id: 'test-usage-id' },
        data: {
          status: 'error',
          error: 'Test error',
          cost: 0
        }
      })
    })
  })

  describe('postLogUsage', () => {
    it('should adjust credits and update usage entry with final cost for paid model', async () => {
      const params = {
        prompt: 'Test prompt',
        model: 'test-paid-model'
      }
      
      const apiKey = {
        user: {
          id: 'test-user-id'
        }
      }
      
      const usageLogEntry = {
        id: 'test-usage-id',
        cost: 5000
      }
      
      const imageResult = {
        latency: 1500
      }

      const result = await postLogUsage(params, apiKey, usageLogEntry, imageResult)
      
      // Verify price calculations
      expect(preCalcPrice).toHaveBeenCalledWith('test-paid-model', undefined, undefined)
      expect(postCalcPrice).toHaveBeenCalledWith('test-paid-model', undefined, undefined, imageResult)
      
      // Verify transaction was called
      expect(prisma.$transaction).toHaveBeenCalled()
      
      // Verify the transaction functions were called with correct parameters
      const transactionMock = prisma.$transaction.mock.calls[0][0]
      const transactionObj = { 
        user: { update: jest.fn() }, 
        APIUsage: { update: jest.fn() } 
      }
      
      await transactionMock(transactionObj)
      
      // Should refund the difference between pre-price and post-price (5000 - 3000 = 2000)
      expect(transactionObj.user.update).toHaveBeenCalledWith({
        where: { id: 'test-user-id' },
        data: { credits: { increment: 2000 } }
      })
      
      expect(transactionObj.APIUsage.update).toHaveBeenCalledWith({
        where: { id: 'test-usage-id' },
        data: {
          speedMs: 1500,
          status: 'success',
          cost: 3000
        }
      })
      
      // Should return the post price
      expect(result).toBe(3000)
    })
    
    it('should not adjust credits for free models', async () => {
      const params = {
        prompt: 'Test prompt',
        model: 'test-free-model'
      }
      
      const apiKey = {
        user: {
          id: 'test-user-id'
        }
      }
      
      const usageLogEntry = {
        id: 'test-usage-id',
        cost: 0 // Free model with 0 cost
      }
      
      const imageResult = {
        latency: 1500
      }

      const result = await postLogUsage(params, apiKey, usageLogEntry, imageResult)
      
      // Verify price calculations
      expect(preCalcPrice).toHaveBeenCalledWith('test-free-model', undefined, undefined)
      expect(postCalcPrice).toHaveBeenCalledWith('test-free-model', undefined, undefined, imageResult)
      
      // Verify transaction was called
      expect(prisma.$transaction).toHaveBeenCalled()
      
      // Verify the transaction functions were called with correct parameters
      const transactionMock = prisma.$transaction.mock.calls[0][0]
      const transactionObj = { 
        user: { update: jest.fn() }, 
        APIUsage: { update: jest.fn() } 
      }
      
      await transactionMock(transactionObj)
      
      // No refund needed for free model (0 - 0 = 0)
      expect(transactionObj.user.update).toHaveBeenCalledWith({
        where: { id: 'test-user-id' },
        data: { credits: { increment: 0 } }
      })
      
      expect(transactionObj.APIUsage.update).toHaveBeenCalledWith({
        where: { id: 'test-usage-id' },
        data: {
          speedMs: 1500,
          status: 'success',
          cost: 0
        }
      })
      
      // Should return 0 cost
      expect(result).toBe(0)
    })
  })
}) 