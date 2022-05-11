const cardano = require('./cardano')

const queryUtxo = (account) => {
  const paymentAddr = cardano.wallet(account).paymentAddr
  let res = cardano.queryUtxo(paymentAddr)
  return res
}

exports.queryUtxo = queryUtxo
