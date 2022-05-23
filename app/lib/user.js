import bcrypt from 'bcrypt'
import prisma from './prisma'

const saltRounds = 10

export async function createUser({ email, firstname, lastname, password }) {
  bcrypt
    .hash(password, saltRounds)
    .then((hash) => {
      const user = prisma.user.create({
        data: {
          email,
          firstname,
          lastname,
          password: hash,
        },
      })
      return user
    })
    .catch((err) => console.error(err.message))
}

export async function getUserByEmail(email) {
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
    include: {
      Wallet: {
        select: {
          name: true,
        },
      },
    },
  })

  // let wallets = []
  // for (const key in user.Wallet) {
  //   wallets.push(user.Wallet[key].name)
  // }
  user.wallets = user.Wallet
  delete user.Wallet

  return user
}

export async function getUserById(id) {
  const user = await prisma.user.findUnique({
    where: {
      id: parseInt(id),
    },
    include: {
      Wallet: {
        select: {
          name: true,
        },
      },
    },
  })

  // let wallets = []
  // for (const key in user.Wallet) {
  //   wallets.push(user.Wallet[key].name)
  // }
  user.wallets = user.Wallet
  delete user.Wallet

  return user
}

export async function validatePassword(user, inputPassword) {
  try {
    const valid = await bcrypt.compare(inputPassword, user.password)
    return valid
  } catch (err) {
    console.error(err.message)
  }
}
