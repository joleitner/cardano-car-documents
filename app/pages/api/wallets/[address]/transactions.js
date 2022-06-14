import nextConnect from 'next-connect'
import auth from '../../../../middleware/auth'
import WalletManager from '../../../../src/cardano/walletManager'
import {
  getWalletByAddress,
  getWalletById,
} from '../../../../src/models/wallets'

const handler = nextConnect()
const walletManager = new WalletManager()

handler
  .use(auth)
  .get(async (req, res) => {
    const { address } = req.query

    const wallet = address.startsWith('addr_')
      ? await getWalletByAddress(address)
      : await getWalletById(address)

    if (wallet) {
      const transactions = await walletManager.getTransactionHistory(wallet.id)
      return res.json(transactions)
    }
    res.json({})
  })
  .post(async (req, res) => {
    //todo
    res.json({ status: 111 })
  })

export default handler
