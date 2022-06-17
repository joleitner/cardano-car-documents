import cardano from './cardano'

class TransactionManager {
  async createTransaction(sender_walletId, receiver_address, amountAda, asset) {
    // sender value fix for undefined value
    // all values need to be included in case sender has tokens
    const sender = cardano.wallet(sender_walletId)
    const ASSET_ID = asset ? asset.policy_id + '.' + asset.asset_name : null

    let senderValues = sender.balance().value
    delete senderValues.undefined

    // create raw transaction
    let txInfo = {
      txIn: sender.balance().utxo,
      txOut: [
        //value going back to sender
        {
          address: sender.paymentAddr,
          value: {
            ...senderValues,
            lovelace:
              sender.balance().value.lovelace - cardano.toLovelace(amountAda),
          },
        },
        //value going to receiver
        {
          address: receiver_address,
          value: { lovelace: cardano.toLovelace(amountAda) },
        },
      ],
    }
    // check if an asset is selected then add it to the transaction
    if (ASSET_ID) {
      txInfo.txOut[0].value[ASSET_ID] = 0 //only for nfts with quantitiy 1
      txInfo.txOut[1].value[ASSET_ID] = 1
      // min amount 1.5 Ada with tokens
      if (txInfo.txOut[1].value.lovelace < 1.5) {
        let diff = 1.5 - txInfo.txOut[1].value.lovelace
        txInfo.txOut[1].value.lovelace += diff
        txInfo.txOut[0].value.lovelace -= diff
      }
    }

    let raw = cardano.transactionBuildRaw(txInfo)

    //calculate fee
    let fee = cardano.transactionCalculateMinFee({
      ...txInfo,
      txBody: raw,
      witnessCount: 1,
    })
    console.log(`Calculated transaction fee ${cardano.toAda(fee)} Ada`)

    //pay the fee by subtracting it from the sender utxo
    txInfo.txOut[0].value.lovelace -= fee

    //create final transaction
    let tx = cardano.transactionBuildRaw({ ...txInfo, fee })

    //sign the transaction
    let txSigned = cardano.transactionSign({
      txBody: tx,
      signingKeys: [sender.payment.skey],
    })

    //broadcast transaction
    let txHash = cardano.transactionSubmit(txSigned)
    return {
      txHash: txHash,
      fee: fee,
    }
  }
}

module.exports = TransactionManager
