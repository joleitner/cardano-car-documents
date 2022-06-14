import prisma from '../prisma'
import cardano from '../cardano/cardano'
import WalletManager from '../cardano/walletManager'

const walletManager = new WalletManager()

export async function createNewPolicy(organizationId, type, name) {
  let policy = await prisma.policy.create({
    data: {
      type,
      name,
      organizations: {
        connect: { id: organizationId }, // connect new policy to organization
      },
    },
  })

  // create policy keypair (wallet)
  let wallet = await prisma.wallet.create({ data: {} })
  walletManager.createPolicyKeys(wallet.id)

  // create policy script depending on type
  let policyScript = {}
  switch (type) {
    case 'owner':
      policyScript = {
        type: 'sig',
        keyHash: cardano.addressKeyHash(wallet.id),
      }
      break
    case 'registration':
      policyScript = {
        type: 'sig',
        keyHash: cardano.addressKeyHash(wallet.id),
      }
  }

  const policyId = cardano.transactionPolicyid(policyScript)
  // update policy with actual policyId
  policy = await prisma.policy.update({
    where: {
      policyId: policy.id,
    },
    data: {
      policyId,
      script: policyScript,
    },
  })

  // connect policy to wallet (policy keys)
  wallet = await prisma.wallet.update({
    where: {
      id: wallet.id,
    },
    data: {
      policyId: policyId,
    },
  })

  return policy
}

export async function getPolicyById(id) {
  let policy = await prisma.policy.findUnique({
    where: {
      policyId: id,
    },
    include: {
      Wallet: true,
    },
  })
  return policy
}

export async function getAllPolicies() {
  let policies = await prisma.policy.findMany()
  return policies
}
