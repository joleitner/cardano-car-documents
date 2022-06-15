const Cardano = require('cardanocli-js')

const options = {}
options.network = 'testnet-magic 1097911063'
options.shelleyGenesisPath = './config/testnet-shelley-genesis.json'
options.socketPath = '/ipc/node.socket'

const cardano = new Cardano(options)

module.exports = cardano
