import cardano from './cardano'

class TransactionManager {
  createTransaction(sender, receiver, amountAda) {
    // sender value fix for undefined value
    // all values need to be included in case sender has tokens
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
          address: receiver,
          value: { lovelace: cardano.toLovelace(amountAda) },
        },
      ],
      // metadata: { 1: { cardano: "First Metadata from cardanocli-js" } },
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
