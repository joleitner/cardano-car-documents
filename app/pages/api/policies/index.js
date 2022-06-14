import nextConnect from 'next-connect'
import auth from '../../../middleware/auth'
import { getOrganizationById } from '../../../src/models/organizations'
import { createNewPolicy, getAllPolicies } from '../../../src/models/policies'
import AssetManager from '../../../src/cardano/assetManager'

const handler = nextConnect()
const assetManager = new AssetManager()

handler
  .use(auth)
  .get(async (req, res) => {
    const policies = await getAllPolicies()
    res.json(policies)
  })
  .post(async (req, res) => {
    const user = await req.user
    // only admins of organizations can create a new policy
    if (user.organizationId == null) {
      return res.json({ status: 401, message: 'Unauthorized' })
    }
    const { type, name } = req.body

    const policy = createNewPolicy(user.organizationId, type, name)

    res.json({ status: 200, message: 'New policy created!', policy })
  })

export default handler

//0b29c6c5158586f1ce1820a595f8c985c87b243e5205a3188bbc1427
