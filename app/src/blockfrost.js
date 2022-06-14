import { BlockFrostAPI } from '@blockfrost/blockfrost-js'

const PROJECT_ID = process.env.BLOCKFROST_PROJECT_ID

const blockfrostApi = new BlockFrostAPI({
  projectId: PROJECT_ID,
})

module.exports = blockfrostApi
