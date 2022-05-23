import nextConnect from 'next-connect'
import WalletManager from '../../../lib/cardano/walletManager'
import TransactionManager from '../../../lib/cardano/transactionManager'
import auth from '../../../middleware/auth'
import prisma from '../../../lib/prisma'
import { v4 as uuidv4 } from 'uuid'

const handler = nextConnect()
const walletManager = new WalletManager()
const transactionManager = new TransactionManager()

handler
  .use(auth)
  .get(async (req, res) => {
    const user = await req.user
    if (user?.admin) {
      res.json({ wallets: walletManager.getWallets() })
    } else {
      res.json({ status: 401, message: 'Unauthorized' })
    }
  })
  .post(async (req, res) => {
    if (!req.user) {
      return res.status(401).end('Unauthorized')
    }
    const user = await req.user
    const name = uuidv4()

    let newWallet = await walletManager.createWallet(name)
    // send every wallet 5 Ada
    transactionManager.createTransaction(
      walletManager.getWallet('main'),
      newWallet.paymentAddr,
      5
    )
    if (newWallet) {
      try {
        const wallet = await prisma.wallet.create({
          data: {
            name,
            userId: user.id,
          },
        })

        return res.status(201).json(wallet)
      } catch (err) {
        console.error(err)
      }
    }
    res.json({ message: 'could not create wallet' })
  })
  .delete(async (req, res) => {
    const walletName = req.body.name
    const user = await req.user
    const wallet = await prisma.wallet.findUnique({
      where: {
        name: walletName,
      },
    })
    if (wallet.userId == user.id || user.admin) {
      await prisma.wallet.delete({
        where: {
          name: walletName,
        },
      })
      const deleted = await walletManager.deleteWallet(req.body.name)

      res.json({ deleted: deleted })
    } else {
      return res.status(401).end('Unauthorized')
    }
  })

export default handler
