import prisma from '../prisma'
import WalletManager from '../cardano/walletManager'
import TransactionManager from '../cardano/transactionManager'

const walletManager = new WalletManager()
const transactionManager = new TransactionManager()

export async function createWallet() {
  let wallet = await prisma.wallet.create({
    data: {},
  })
  const cardanoWallet = walletManager.createWallet(wallet.id)
  wallet = await prisma.wallet.update({
    where: {
      id: wallet.id,
    },
    data: {
      address: cardanoWallet.paymentAddr,
    },
  })

  // todo

  // every new created wallet gets 5 Ada to experiment with
  transactionManager.createTransaction(
    walletManager.getWallet('1'), // from main (1) wallet
    cardanoWallet.paymentAddr,
    5
  )

  return wallet
}

export async function getWalletById(id) {
  let wallet = await prisma.wallet.findUnique({
    where: {
      id: parseInt(id),
    },
  })
  if (wallet) {
    const info = await walletManager.getWalletInfo(wallet.id)
    return {
      ...wallet,
      amount: info.amount,
    }
  } else {
    return {}
  }
}

export async function getWalletByAddress(address) {
  let wallet = await prisma.wallet.findUnique({
    where: {
      address,
    },
  })
  if (wallet) {
    const info = await walletManager.getWalletInfo(wallet.id)
    return {
      ...wallet,
      amount: info.amount,
    }
  } else {
    return {}
  }
}

export async function getWalletByUser(id) {
  const user = await prisma.user.findUnique({
    where: {
      id: parseInt(id),
    },
    include: {
      Wallet: true,
    },
  })
  return user.Wallet
}

export async function deleteWallet(id) {
  await prisma.wallet.delete({
    where: {
      id: id,
    },
  })
  const deleted = await walletManager.deleteWallet(id)

  return deleted
}

export async function getAllWallets() {
  const wallets = await prisma.wallet.findMany()
  return wallets
}
