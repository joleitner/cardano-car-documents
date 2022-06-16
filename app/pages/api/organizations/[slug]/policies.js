import nextConnect from 'next-connect'
import auth from '../../../../middleware/auth'
import { isNumeric } from '../../../../src/helper'
import {
  getOrganizationById,
  getOrganizationBySlug,
} from '../../../../src/models/organizations'
import { getPoliciesFromOrganization } from '../../../../src/models/policies'

const handler = nextConnect()

handler.use(auth).get(async (req, res) => {
  const { slug } = req.query

  const organization = isNumeric(slug)
    ? await getOrganizationById(slug)
    : await getOrganizationBySlug(slug)

  const policies = await getPoliciesFromOrganization(organization.id)

  res.json(policies)
})

export default handler
