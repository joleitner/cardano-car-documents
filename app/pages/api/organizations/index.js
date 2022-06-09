import nextConnect from 'next-connect'
import auth from '../../../middleware/auth'
import {
  getAllOrganizations,
  createOrganization,
} from '../../../src/models/organizations'

const handler = nextConnect()

handler
  .use(auth)
  .get(async (req, res) => {
    const result = await getAllOrganizations()
    res.json(result)
  })

  .post(async (req, res) => {
    const organization = await createOrganization(req.body)
    res.status(201).json({ organization })
  })

export default handler
