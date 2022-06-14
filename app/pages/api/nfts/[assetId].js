import nextConnect from 'next-connect'
import auth from '../../../middleware/auth'
import Pinata from '../../../src/pinata'
import AssetManager from '../../../src/cardano/assetManager'

const handler = nextConnect()
const assetManager = new AssetManager()

handler.use(auth).get(async (req, res) => {
  const { assetId } = req.query

  const result = await assetManager.getAsset(assetId)
  res.json(result)
})

export default handler
