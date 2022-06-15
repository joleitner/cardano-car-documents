const prisma = require('../src/prisma')
const cardano = require('../src/cardano/cardano')

const createWallet = (id) => {
  let paymentKeys = cardano.addressKeyGen(id)
  cardano.addressBuild(id, {
    paymentVkey: paymentKeys.vkey,
  })
  return cardano.wallet(id)
}
const createPolicyKeys = (id) => {
  cardano.addressKeyGen(`${id}_policy`)
  return cardano.wallet(`${id}_policy`)
}

async function main() {
  // create main (1) wallet for authority and other cost like topping up new wallets
  const cardanoWallet = createWallet('1')
  const walletMain = await prisma.wallet.upsert({
    where: { id: 1 },
    update: {},
    create: {
      address: cardanoWallet.paymentAddr,
    },
  })
  console.log('----------------------------------------------')
  console.log(
    `Go to: https://testnets.cardano.org/en/testnets/cardano/tools/faucet/ and topup your wallet with some tAda.\nAddress: ${walletMain.address}`
  )
  console.log('----------------------------------------------')

  // create registration authority
  const registrationAuthority = await prisma.organization.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Registration office',
      slug: 'registration',
      type: 'authority',
      description: 'Main organization in charge of registrations',
      walletId: 1,
    },
  })

  const admin = await prisma.user.upsert({
    where: { id: 1 },
    update: {},
    create: {
      email: 'admin',
      password: '$2b$10$MWuyAS4jTDO9J9NNGrTfn.1dW.P3Jg4O2vAzI.PbZaHMw7UN20WAq', //admin
      firstname: 'admin',
      lastname: 'cardano_cars',
      admin: true,
      walletId: 1,
      organizationId: 1,
    },
  })

  // create main policy for authority and the keys for multisig
  const policyKeys = createPolicyKeys('2')
  const policyScript = {
    type: 'sig',
    keyHash: cardano.addressKeyHash(policyKeys.name),
  }
  const policyId = cardano.transactionPolicyid(policyScript)

  const policy = await prisma.policy.upsert({
    where: { policyId: policyId },
    update: {},
    create: {
      policyId,
      name: 'Registration',
      type: 'registration',
      script: policyScript,
      organizations: {
        connect: { id: 1 }, // registration authority
      },
    },
  })
  const policyWallet = await prisma.wallet.upsert({
    where: { id: 2 },
    update: {},
    create: {
      policyId,
    },
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
