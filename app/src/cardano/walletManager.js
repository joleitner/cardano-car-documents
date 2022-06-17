import cardano from './cardano'
import blockfrostApi from '../blockfrost'
import fs from 'fs'

class WalletManager {
  constructor() {
    this.walletDir = './priv/wallet/'
  }

  createWallet(name) {
    let paymentKeys = cardano.addressKeyGen(name)
    // let stakeKeys = cardano.stakeAddressKeyGen(name)
    // let stakeAddr = cardano.stakeAddressBuild(name)
    let paymentAddr = cardano.addressBuild(name, {
      paymentVkey: paymentKeys.vkey,
    })
    return cardano.wallet(name)
  }

  createPolicyKeys(id) {
    let policyKeys = cardano.addressKeyGen(`${id}_policy`)
    return cardano.wallet(`${id}_policy`)
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

  async getWalletInfo(name) {
    let wallet = cardano.wallet(name)
    try {
      const info = await blockfrostApi.addresses(wallet.paymentAddr)
      return info
    } catch (error) {
      return {}
    }
  }

  async showBalance(name) {
    let wallet = cardano.wallet(name)
    return wallet.balance()
  }

  getTransactionHistory(name) {
    const wallet = cardano.wallet(name)
    try {
      const transactions = blockfrostApi.addressesTransactions(
        wallet.paymentAddr
      )
      return transactions
    } catch (error) {
      return {}
    }
  }
}

module.exports = WalletManager
