import nextConnect from 'next-connect'
import auth from '../../../../middleware/auth'
import { isNumeric } from '../../../../src/helper'
import {
  getOrganizationById,
  getOrganizationBySlug,
} from '../../../../src/models/organizations'

const handler = nextConnect()

handler.use(auth).get(async (req, res) => {
  const { slug } = req.query

  const organization = isNumeric(slug)
    ? await getOrganizationById(slug)
    : await getOrganizationBySlug(slug)

  res.json(organization)
})

export default handler
