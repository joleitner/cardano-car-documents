import AssetList from '../components/AssetList'
import Container from 'react-bootstrap/Container'
import { useState, useEffect } from 'react'

export default function Home() {
  const [assets, setAssets] = useState([])

  const getAllAssets = async () => {
    fetch('api/nfts').then(async (res) => {
      setAssets(await res.json())
    })
  }

  useEffect(() => {
    getAllAssets()
  }, [])

  return (
    <Container className={'mb-5'}>
      <div className="text-center fw-bold fs-5 mb-3">Cardano Car NFTs</div>
      <AssetList assets={assets} />
    </Container>
  )
}
