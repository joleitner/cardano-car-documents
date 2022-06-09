import nextConnect from 'next-connect'
import auth from '../../../../middleware/auth'
import { getOrganizationBySlug } from '../../../../src/models/organizations'

const handler = nextConnect()

handler.use(auth).get(async (req, res) => {
  const { slug } = req.query

  const organization = await getOrganizationBySlug(id)
  res.json(organization)
})

export default handler
