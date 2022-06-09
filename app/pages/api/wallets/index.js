import nextConnect from 'next-connect'
import auth from '../../../middleware/auth'
import {
  getAllWallets,
  createWallet,
  deleteWallet,
} from '../../../src/models/wallets'

const handler = nextConnect()

handler
  .use(auth)
  .get(async (req, res) => {
    const user = await req.user
    if (user?.admin) {
      res.json({ wallets: await getAllWallets() })
    } else {
      res.json({ status: 401, message: 'Unauthorized' })
    }
  })
  .post(async (req, res) => {
    if (user?.admin) {
      const wallet = await createWallet()
      res.json(wallet)
    } else {
      res.json({ status: 401, message: 'Unauthorized' })
    }
  })
  .delete(async (req, res) => {
    const walletId = req.body.id
    const user = await req.user

    if (user?.admin) {
      deleteWallet(walletId)
    } else {
      res.json({ status: 401, message: 'Unauthorized' })
    }
  })

export default handler
