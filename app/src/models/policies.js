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
        keyHash: cardano.addressKeyHash(`${wallet.id}_policy`),
      }
      break
    case 'registration':
      policyScript = {
        type: 'sig',
        keyHash: cardano.addressKeyHash(`${wallet.id}_policy`),
      }
  }

  const policyId = cardano.transactionPolicyid(policyScript)
  // update policy with actual policyId
  policy = await prisma.policy.update({
    where: {
      policyId: policy.policyId,
    },
    data: {
      policyId: policyId,
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
      organizations: true,
    },
  })
  return policy
}

export async function getAllPolicies() {
  let policies = await prisma.policy.findMany({
    include: {
      organizations: true,
    },
  })
  return policies
}

export async function getPoliciesFromOrganization(organizationId) {
  let policies = await prisma.organization
    .findUnique({ where: { id: organizationId } })
    .policies()
  // let policies = await prisma.policy.findMany({
  //   where: {
  //     organizations: {
  //       every: {
  //         id: organizationId,
  //       },
  //     },
  //   },
  //   // include: {
  //   //   organizations: true,
  //   // },
  // })
  return policies
}
