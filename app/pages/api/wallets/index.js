import nextConnect from 'next-connect'
import WalletManager from '../../../lib/cardano/walletManager'
import auth from '../../../middleware/auth'
import prisma from '../../../lib/prisma'
import { findUserById } from '../../../lib/user'
import { v4 as uuidv4 } from 'uuid'
const { queryUtxo } = require('../../../lib/cardano/query')

const handler = nextConnect()
const walletManager = new WalletManager()

handler
  .use(auth)
  .get(async (req, res) => {
    const user = await req.user
    if (user?.admin) {
      res.json({ wallets: walletManager.listWallets() })
    } else {
      res.json({ status: 401, message: 'Unauthorized' })
    }
  })
  .post(async (req, res) => {
    if (!req.user) {
      return res.status(401).end('Unauthorized')
    }
    const user = await req.user
    const account = uuidv4()
    let newWallet = walletManager.createWallet(account)
    if (newWallet) {
      try {
        const wallet = await prisma.wallet.create({
          data: {
            account,
            userId: user.id,
          },
        })
        return res.status(201).json(newWallet)
      } catch (err) {
        console.error(err)
      }
    }
    res.json({ message: 'could not create wallet' })
  })
  .delete((req, res) => {
    if (!req.user) {
      return res.status(401).end('Unauthorized')
    }

    let deleted = walletManager.deleteWallet(req.body.account)
    res.json({ deleted: deleted })
  })

export default handler
