import cardano from './cardano'
import fs from 'fs'

class WalletManager {
  constructor() {
    this.walletDir = './priv/wallet/'
  }

  createWallet(name) {
    let paymentKeys = cardano.addressKeyGen(name)
    let stakeKeys = cardano.stakeAddressKeyGen(name)
    let stakeAddr = cardano.stakeAddressBuild(name)
    let paymentAddr = cardano.addressBuild(name, {
      paymentVkey: paymentKeys.vkey,
      stakeVkey: stakeKeys.vkey,
    })
    return cardano.wallet(name)
  }

  deleteWallet(name) {
    let accountDir = this.walletDir + name
    try {
      fs.rmSync(accountDir, { recursive: true })
      return true
    } catch {
      return false
    }
  }

  getWallets() {
    let wallets = []
    fs.readdirSync(this.walletDir).forEach((file) => {
      wallets.push(this.getWallet(file))
    })
    return wallets
  }

  getWallet(name) {
    return cardano.wallet(name)
  }

  showBalance(name) {
    let wallet = cardano.wallet(name)
    return wallet.balance()
  }
}

module.exports = WalletManager
