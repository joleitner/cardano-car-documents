const cardano = require('./cardano')
const fs = require('fs')

class WalletManager {
  constructor() {
    this.walletDir = './priv/wallet/'
  }

  createWallet(account) {
    let paymentKeys = cardano.addressKeyGen(account)
    let stakeKeys = cardano.stakeAddressKeyGen(account)
    let stakeAddr = cardano.stakeAddressBuild(account)
    let paymentAddr = cardano.addressBuild(account, {
      paymentVkey: paymentKeys.vkey,
      stakeVkey: stakeKeys.vkey,
    })
    return cardano.wallet(account)
  }

  deleteWallet(account) {
    let accountDir = this.walletDir + account
    try {
      fs.rmSync(accountDir, { recursive: true })
      return true
    } catch {
      return false
    }
  }

  listWallets() {
    let wallets = []
    fs.readdirSync(this.walletDir).forEach((file) => {
      wallets.push(file)
    })
    return wallets
  }

  showBalance(account) {
    let wallet = cardano.wallet(account)
    return wallet.balance()
  }
}

module.exports = WalletManager
