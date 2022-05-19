import nextConnect from 'next-connect'
import WalletManager from '../../../lib/cardano/walletManager'
import prisma from '../../../lib/prisma'
import auth from '../../../middleware/auth'

const handler = nextConnect()
const walletManager = new WalletManager()

handler.use(auth).get((req, res) => {
  const { account } = req.query
  res.json({ balance: walletManager.showBalance(account) })
})

export default handler
