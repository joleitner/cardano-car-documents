import pinataSDK from '@pinata/sdk'
import fs from 'fs'
import path from 'path'

// const PINATA_API_KEY = process.env.PINATA_API_KEY
// const PINATA_SECRET_API_KEY = process.env.PINATA_SECRET_API_KEY
const pinata = pinataSDK(
  process.env.PINATA_API_KEY,
  process.env.PINATA_SECRET_API_KEY
)

class Pinata {
  async testAuthentication() {
    const data = await pinata.testAuthentication()
    return data
  }
  async pinList() {
    const result = await pinata.pinList()
    return result
  }

  async uploadCarThumbnail(vin, file) {
    const readableStreamForFile = fs.createReadStream(file.filepath)
    const options = {
      pinataMetadata: {
        name: `${vin}_img`,
      },
      pinataOptions: {
        cidVersion: 0,
      },
    }
    const result = await pinata.pinFileToIPFS(readableStreamForFile, options)
    return result
  }

  async uploadCarTechspec(vin, data) {
    const options = {
      pinataMetadata: {
        name: `${vin}_techspec`,
      },
      pinataOptions: {
        cidVersion: 0,
      },
    }

    const result = await pinata.pinJSONToIPFS(data, options)
    return result
  }
}

module.exports = Pinata
