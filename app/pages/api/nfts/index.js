import nextConnect from 'next-connect'
import auth from '../../../middleware/auth'
import parseMultipartForm from '../../../middleware/multipart-form-parser'
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
  .use(parseMultipartForm)
  .post(async (req, res) => {
    const user = await req.user
    // only admins of organizations can create nfts
    if (user?.organizationId == null) {
      return res.json({ status: 401, message: 'Unauthorized' })
    }
    const organzation = await getOrganizationById(user.organizationId)

    const { policyId, vin } = await req.body
    const creatorWalletId = organzation.walletId
    let specs = req.body
    delete specs.policyId
    delete specs.vin
    const nftData = {
      vin: vin,
      image: await req.files['image'],
      specs: specs,
    }

    const txHash = await assetManager.mintOwnerNFT(
      policyId,
      creatorWalletId,
      nftData
    )
    res.status(201).json({ message: 'New NFT created!', txHash: txHash })
  })

export const config = {
  api: {
    bodyParser: false,
  },
}

export default handler
