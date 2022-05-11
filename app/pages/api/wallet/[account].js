import WalletManager from '../../../lib/cardano/walletManager'

const walletManager = new WalletManager()

export default function handler(req, res) {
  const { account } = req.query

  switch (req.method) {
    case 'GET':
      res.json({ balance: walletManager.showBalance(account) })
  }
}
