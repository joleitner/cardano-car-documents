import bcrypt from 'bcrypt'
import prisma from '../prisma'
import { createWallet } from './wallets'

const saltRounds = 10

export async function createUser({ email, firstname, lastname, password }) {
  const hash = await bcrypt.hash(password, saltRounds)
  let user = await prisma.user.create({
    data: {
      email,
      firstname,
      lastname,
      password: hash,
    },
  })
  // if a user signs up he should directly get a wallet assigned
  const wallet = await createWallet()
  user = await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      walletId: wallet.id,
    },
  })

  return user
}

export async function getUserByEmail(email) {
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  })

  return user
}

export async function getUserById(id) {
  const user = await prisma.user.findUnique({
    where: {
      id: parseInt(id),
    },
  })

  return user
}

export async function getAllUsers() {
  const users = await prisma.user.findMany()
  return users
}

export async function validatePassword(user, inputPassword) {
  try {
    const valid = await bcrypt.compare(inputPassword, user.password)
    return valid
  } catch (err) {
    console.error(err.message)
  }
}
