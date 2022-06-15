const { PrismaClient } = require('@prisma/client')

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.

let prisma

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient()
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient()
  }
  prisma = global.prisma
}

module.exports = prisma
