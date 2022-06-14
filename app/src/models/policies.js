import prisma from '../prisma'
import cardano from '../cardano/cardano'
import WalletManager from '../cardano/walletManager'

const walletManager = new WalletManager()

export async function createNewPolicy(organizationId) {
  let policy = await prisma.policy.create({
    data: {
      organizations: {
        connect: { id: organizationId }, // connect new policy to organization
      },
    },
  })

  // create keypair (wallet) assoziated with policy
  let wallet = await prisma.wallet.create({
    data: {
      policyId: policy.id,
    },
  })
  const cardanoWallet = walletManager.createWallet(wallet.id)
  //   wallet = await prisma.wallet.update({
  //     where: {
  //       id: wallet.id,
  //     },
  //     data: {
  //       address: cardanoWallet.paymentAddr,
  //     },
  //   })

  // create policy script
  const policyScript = {
    type: 'sig',
    keyHash: cardano.addressKeyHash(wallet.id),
  }
  const policyId = cardano.transactionPolicyid(policyScript)

  policy = await prisma.policy.update({
    where: {
      id: policy.id,
    },
    data: {
      policyId,
      policyScript,
    },
  })

  return policy
}

export async function getPolicyById(id) {
  let policy = await prisma.policy.findUnique({
    where: {
      id: parseInt(id),
    },
    include: {
      Wallet: true,
    },
  })
  return policy
}
