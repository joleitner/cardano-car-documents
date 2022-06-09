import prisma from '../prisma'

export async function createOrganization({ name, slug, type, description }) {
  let organization = await prisma.organization.create({
    data: {
      name,
      slug,
      type,
      description,
    },
  })
  return organization
}

export async function getOrganizationById(id) {
  let organization = await prisma.organization.findUnique({
    where: {
      id,
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
