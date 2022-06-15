import cardano from './cardano'
import Pinata from '../pinata'
import blockfrostApi from '../blockfrost'
import { stringToBase16 } from '../helper'
import { getPolicyById } from '../models/policies'

const pinata = new Pinata()

class AssetManager {
  async mintOwnerNFT(policyId, creatorWalletId, { vin, thumbnail, specs }) {
    const ASSETNAME = vin
    const ASSETNAME_ENCODED = stringToBase16(ASSETNAME)
    const policy = await getPolicyById(policyId)
    const POLICY_ID = policyId
    const ASSET_ID = POLICY_ID + '.' + ASSETNAME_ENCODED
    const creatorWallet = cardano.wallet(creatorWalletId)

    // 1. upload to pinata
    const resThumbnail = await pinata.uploadCarThumbnail(vin, thumbnail)
    const resSpecs = await pinata.uploadCarTechspec(vin, specs)

    //2. define metadata with CIP-25 standard
    const metadata = {
      721: {
        [POLICY_ID]: {
          [ASSETNAME_ENCODED]: {
            name: ASSETNAME,
            image: `ipfs://${resThumbnail.IpfsHash}`,
            files: [
              {
                name: `${vin}_img`,
                mediaType: 'application/json',
                src: `ipfs://${resSpecs.IpfsHash}`,
              },
            ],
          },
        },
      },
    }

    //3. create raw minting transaction
    let creatorAssets = creatorWallet.balance().value
    delete creatorAssets.undefined

    let txInfo = {
      txIn: creatorWallet.balance().utxo,
      txOut: [
        {
          address: creatorWallet.paymentAddr,
          value: {
            ...creatorAssets,
            [ASSET_ID]: 1,
          },
        },
      ],
      mint: [
        {
          action: 'mint',
          quantity: 1,
          asset: ASSET_ID,
          script: policy.script,
        },
      ],
      metadata,
    }
    let raw = cardano.transactionBuildRaw(txInfo)

    //4. calculate fee
    let fee = cardano.transactionCalculateMinFee({
      ...txInfo,
      txBody: raw,
      witnessCount: 2, //for keys
    })
    console.log(`Calculated transaction fee ${cardano.toAda(fee)} Ada`)

    //5. create final transaction
    //pay the fee by subtracting it from the creator's wallet utxo
    txInfo.txOut[0].value.lovelace -= fee
    let tx = cardano.transactionBuildRaw({ ...txInfo, fee })

    //6. sign the transaction
    const policyKeys = cardano.wallet(`${policy.Wallet[0].id}_policy`).payment
    let txSigned = cardano.transactionSign({
      txBody: tx,
      signingKeys: [creatorWallet.payment.skey, policyKeys.skey],
    })

    //7. finally broadcast transaction and mint nft
    let txHash = cardano.transactionSubmit(txSigned)
    console.log('TxHash: ' + txHash)

    return { txHash }
  }

  async getAsset(assetId) {
    const result = await blockfrostApi.assetsById(assetId)
    return result
  }

  async getPolicyAssets(policyId) {
    const assetNames = await blockfrostApi.assetsPolicyById(policyId)

    // const assets = []
    // for (const name of assetNames) {
    //   const asset = await this.getAsset(name.asset)
    //   assets.push(asset)
    // }

    return assetNames
  }
}

module.exports = AssetManager
