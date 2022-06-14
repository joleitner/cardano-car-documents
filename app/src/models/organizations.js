import prisma from '../prisma'
import { createWallet } from './wallets'

export async function createOrganization({ name, slug, type, description }) {
  let organization = await prisma.organization.create({
    data: {
      name,
      slug,
      type,
      description,
    },
  })

  // if a organization gets created it directly gets a wallet assigned
  const wallet = await createWallet()
  user = await prisma.organization.update({
    where: {
      id: organization.id,
    },
    data: {
      walletId: wallet.id,
    },
  })

  return organization
}

export async function getOrganizationById(id) {
  let organization = await prisma.organization.findUnique({
    where: {
      id: parseInt(id),
    },
  })

  return organization
}

export async function getOrganizationBySlug(slug) {
  let organization = await prisma.organization.findUnique({
    where: {
      slug,
    },
  })

  return organization
}

export async function getAllOrganizations() {
  const organizations = await prisma.organization.findMany()
  return organizations
}
