import nextConnect from 'next-connect'
import auth from '../../../middleware/auth'
import Pinata from '../../../src/pinata'
import AssetManager from '../../../src/cardano/assetManager'
import { getPolicyById } from '../../../src/models/policies'

const handler = nextConnect()
const assetManager = new AssetManager()

handler.use(auth).get(async (req, res) => {
  const { policyId } = req.query
  const policy = await getPolicyById(policyId)

  const assets = await assetManager.getPolicyAssets(policyId)
  res.json({ ...policy, assets })
})

export default handler
