import nextConnect from 'next-connect'
import auth from '../../middleware/auth'
import Pinata from '../../src/pinata'
import { createNewPolicy, getPolicyById } from '../../src/models/policies'
import NFTManager from '../../src/cardano/nftManager'

const handler = nextConnect()
const pinata = new Pinata()
const nftManager = new NFTManager()

handler.use(auth).get(async (req, res) => {
  // const result = await createNewPolicy(2)
  const policyId = 2
  const creatorId = 2
  const nftData = {
    vin: '1',
    thumbnail: 'not there',
    specs: {
      brand: 'Porsche',
      color: 'silver',
    },
  }
  const result = await nftManager.mintOwnerNFT(policyId, creatorId, nftData)
  res.json(result)
})

export default handler
