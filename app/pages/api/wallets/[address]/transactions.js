import nextConnect from 'next-connect'
import auth from '../../../../middleware/auth'
import WalletManager from '../../../../src/cardano/walletManager'
import TransactionManager from '../../../../src/cardano/transactionManager'
import AssetManager from '../../../../src/cardano/assetManager'
import {
  getWalletByAddress,
  getWalletById,
} from '../../../../src/models/wallets'

const handler = nextConnect()
const walletManager = new WalletManager()
const assetManager = new AssetManager()
const transactionManager = new TransactionManager()

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
    const { address } = req.query
    const { receiver_address, amount, assetId } = req.body

    const wallet = address.startsWith('addr_')
      ? await getWalletByAddress(address)
      : await getWalletById(address)

    // check wallet
    if (!wallet) {
      return res.json({ message: 'No valid sender address' })
    }
    // check asset
    let asset = null
    if (assetId) {
      asset = await assetManager.getAsset(assetId)
      if (!asset) {
        return res.json({ message: 'No valid asset id' })
      }
    }

    // create transaction
    const txInfo = await transactionManager.createTransaction(
      wallet.id,
      receiver_address,
      amount,
      asset
    )
    res.json(txInfo)
  })

export default handler
