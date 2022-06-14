import nextConnect from 'next-connect'
import auth from '../../../middleware/auth'
import { getOrganizationById } from '../../../src/models/organizations'
import AssetManager from '../../../src/cardano/assetManager'

const handler = nextConnect()
const assetManager = new AssetManager()

handler
  .use(auth)
  .get(async (req, res) => {
    // const result = await assetManager.getAsset(
    //   '0b29c6c5158586f1ce1820a595f8c985c87b243e5205a3188bbc142731'
    // )
    // res.json(result)
  })
  .post(async (req, res) => {
    const user = await req.user
    // only admins of organizations can create nfts
    if (user.organizationId == null) {
      return res.json({ status: 401, message: 'Unauthorized' })
    }
    const organzation = getOrganizationById(user.organizationId)

    const { policyId, nftData } = req.body
    // const policyId = 2
    const creatorWalletId = organzation.walletId
    // const nftData = {
    //   vin: '1',
    //   thumbnail: 'not there',
    //   specs: {
    //     brand: 'Porsche',
    //     color: 'silver',
    //   },
    // }
    const txHash = await assetManager.mintOwnerNFT(
      policyId,
      creatorWalletId,
      nftData
    )
    res.json({ status: 200, message: 'New NFT created!', txHash })
  })

export default handler
