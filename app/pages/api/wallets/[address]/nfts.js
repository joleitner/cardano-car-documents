import nextConnect from 'next-connect'
import auth from '../../../../middleware/auth'
import {
  getWalletAssets,
  getWalletByAddress,
  getWalletById,
} from '../../../../src/models/wallets'

const handler = nextConnect()

handler.use(auth).get(async (req, res) => {
  const { address } = req.query

  const wallet = address.startsWith('addr_')
    ? await getWalletByAddress(address)
    : await getWalletById(address)

  const assets = await getWalletAssets(wallet.id)

  res.json(assets)
})

export default handler
