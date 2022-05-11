import WalletManager from '../../../lib/cardano/walletManager'
const { queryUtxo } = require('../../../lib/cardano/query')

const walletManager = new WalletManager()

export default function handler(req, res) {
  switch (req.method) {
    case 'POST':
      let newWallet = walletManager.createWallet(req.body.account)
      res.json({ wallet: newWallet })
      break

    case 'DELETE':
      let deleted = walletManager.deleteWallet(req.body.account)
      res.json({ deleted: deleted })
      break

    default:
      res.json({ wallets: walletManager.listWallets() })
  }
}
