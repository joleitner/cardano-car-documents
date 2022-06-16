import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Alert from 'react-bootstrap/Alert'
import Spinner from 'react-bootstrap/Spinner'
import AssetItem from '../../components/AssetItem'
import { useRouter } from 'next/router'
import { useAsset } from '../../hooks/useAsset'

const getAssetImgAddress = (asset) => {
  const ipfsAddress =
    asset.onchain_metadata[asset.policy_id][asset.asset_name].image
  const httpsAddress = ipfsAddress.replace('ipfs://', 'https://ipfs.io/ipfs/')
  return httpsAddress
}

export default function NFT() {
  const router = useRouter()
  const { assetId } = router.query
  const { asset, loading } = useAsset(assetId)
  const [techSpecs, setTechSpecs] = useState([])

  const getAssetJson = async (asset) => {
    const ipfsAddress =
      asset.onchain_metadata[asset.policy_id][asset.asset_name].files[0].src
    const httpsAddress = ipfsAddress.replace('ipfs://', 'https://ipfs.io/ipfs/')

    const res = await fetch(httpsAddress)
    const json = await res.json()
    setTechSpecs([])
  }

  useEffect(() => {
    if (asset) {
      getAssetJson(asset)
    }
  }, [asset])

  if (loading) {
    return (
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    )
  }

  if (!loading && typeof asset == 'undefined') {
    return (
      <Container className={'w-75 mb-5'}>
        <Alert variant="danger" className="text-center">
          No asset found!
        </Alert>
      </Container>
    )
  }

  return (
    <>
      <Container className={'w-50 mb-5 border'}>
        <Image
          src={getAssetImgAddress(asset)}
          alt="img"
          width={600}
          height={320}
        />
        <hr />
        <Container className="bg-light"></Container>
        <h3 className="text-center">{asset.asset_name}</h3>
        <Row>
          <Col className="fw-bold">PolicyId:</Col>
          <Col>{asset.policy_id}</Col>
        </Row>

        {/* {Object.keys(techSpecs).map((key, i) => (
          <Row key={i}>
            <Col>{key}</Col>
            <Col>{techSpecs[key]}</Col>
          </Row>
        ))} */}
        <Row>
          <Col className="fw-bold">specs:</Col>
          <Col>{techSpecs}</Col>
        </Row>
      </Container>
    </>
  )
}
