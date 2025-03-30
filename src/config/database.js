import { PrismaClient } from '@prisma/client'

let prisma

if (process.env.DATABASE_URL) {
    prisma = new PrismaClient()
    console.log('BILLING ON')
} else {
    console.log('BILLING OFF, API is free to use with no authentication required')
}

export { prisma } 