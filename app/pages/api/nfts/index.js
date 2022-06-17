import nextConnect from 'next-connect'
import auth from '../../../middleware/auth'
import parseMultipartForm from '../../../middleware/multipart-form-parser'
import { getOrganizationById } from '../../../src/models/organizations'
import AssetManager from '../../../src/cardano/assetManager'
import { getAllPolicies } from '../../../src/models/policies'
import { getWalletByAddress } from '../../../src/models/wallets'

const handler = nextConnect()
const assetManager = new AssetManager()

handler
  .use(auth)
  .get(async (req, res) => {
    const policies = await getAllPolicies()

    let assets = []
    for (const key in policies) {
      const policyAssets = await assetManager.getPolicyAssets(
        policies[key].policyId
      )
      assets.push(...policyAssets)
    }
    res.json(assets)
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

    const txInfo = await assetManager.mintOwnerNFT(
      policyId,
      creatorWalletId,
      nftData
    )
    res.status(201).json(txInfo)
  })
  .delete(async (req, res) => {
    const { assetId } = req.body
    const asset = await assetManager.getAsset(assetId)
    const wallet = await getWalletByAddress(asset.owner_address)

    const txInfo = await assetManager.burnNFT(asset.policy_id, wallet.id, asset)
    res.json(txInfo)
  })

export const config = {
  api: {
    bodyParser: false,
  },
}

export default handler
