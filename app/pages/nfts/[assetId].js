import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Alert from 'react-bootstrap/Alert'
import Spinner from 'react-bootstrap/Spinner'
import AssetItem from '../../components/AssetItem'
import { useRouter } from 'next/router'
import { useAsset } from '../../hooks/useAsset'
import { usePolicy } from '../../hooks/usePolicy'

const getAssetImgAddress = (asset) => {
  const ipfsAddress =
    asset.onchain_metadata[asset.policy_id][asset.asset_name].image
  const httpsAddress = ipfsAddress.replace('ipfs://', 'https://ipfs.io/ipfs/')
  return httpsAddress
}

const getOnChainData = (asset) => {
  return asset.onchain_metadata[asset.policy_id][asset.asset_name]
}

export default function NFT() {
  const router = useRouter()
  const { assetId } = router.query
  const { asset, loading } = useAsset(assetId)
  const { policy } = usePolicy(asset?.policy_id)
  const [techSpecs, setTechSpecs] = useState([])

  const getAssetJson = async (asset) => {
    const ipfsAddress =
      asset.onchain_metadata[asset.policy_id][asset.asset_name].files[0].src
    const httpsAddress = ipfsAddress.replace('ipfs://', 'https://ipfs.io/ipfs/')

    const res = await fetch(httpsAddress)
    const json = await res.json()
    console.log(json)
    setTechSpecs(json)
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
      <Container className="d-flex justify-content-center">
        <Card style={cardStyle} className="m-3 shadow">
          <Card.Img
            variant="top"
            src={getAssetImgAddress(asset)}
            alt="loading.."
            // style={{ borderTopLeftRadius: '10px', borderTopRightRadius: '10px' }}
          />
          <Card.Body className={'text-center'}>
            <Card.Subtitle
              className={' fw-light mb-2'}
              style={{ letterSpacing: '0.15rem' }}
            >
              {policy?.organizations[0].name}
            </Card.Subtitle>
            <Card.Title>{getOnChainData(asset).name}</Card.Title>
            <Card.Text>{policy?.name}</Card.Text>

            <hr />
            <Container className="text-start">
              <Row>
                <Col className="fw-bold">Policy Id</Col>
                <Col>{asset.policy_id}</Col>
              </Row>
              <Row>
                <Col className="fw-bold">Asset Name</Col>
                <Col>{asset.asset_name}</Col>
              </Row>
            </Container>
            {techSpecs && (
              <Container>
                <div className="text-center fw-bold mt-4 mb-2">
                  Technical specifications
                </div>
                {/* brand */}
                <Row className="text-start">
                  <Col className="fw-bold col-2">D.1</Col>
                  <Col className="fw-bold">Brand</Col>
                  <Col>{techSpecs.brand}</Col>
                </Row>
                {/* version */}
                <Row className="text-start">
                  <Col className="fw-bold col-2">D.2</Col>
                  <Col className="fw-bold">Type/Variant/Version</Col>
                  <Col>{techSpecs.version}</Col>
                </Row>
                {/* trade_name */}
                <Row className="text-start">
                  <Col className="fw-bold col-2">D.3</Col>
                  <Col className="fw-bold">Trade name</Col>
                  <Col>{techSpecs.trade_name}</Col>
                </Row>
                {/* max_mass */}
                <Row className="text-start">
                  <Col className="fw-bold col-2">F.1</Col>
                  <Col className="fw-bold">maximum mass in kg</Col>
                  <Col>{techSpecs.max_mass}</Col>
                </Row>
                {/* empty_mass */}
                <Row className="text-start">
                  <Col className="fw-bold col-2">G</Col>
                  <Col className="fw-bold">Empty mass</Col>
                  <Col>{techSpecs.empty_mass}</Col>
                </Row>
                {/* vehicle_class */}
                <Row className="text-start">
                  <Col className="fw-bold col-2">J</Col>
                  <Col className="fw-bold">Vehicle class</Col>
                  <Col>{techSpecs.vehicle_class}</Col>
                </Row>
                {/* color */}
                <Row className="text-start">
                  <Col className="fw-bold col-2">R</Col>
                  <Col className="fw-bold">Color</Col>
                  <Col>{techSpecs.color}</Col>
                </Row>
              </Container>
            )}
            <Container>
              <div className="fw-bold mt-4 mb-2">Owner Address</div>
              <Link href={`/wallets/${asset.owner_address}`}>
                {asset.owner_address}
              </Link>
            </Container>
          </Card.Body>
        </Card>
      </Container>
    </>
  )
}

const cardStyle = {
  minWidth: '40rem',
  maxWidth: '40rem',
  borderRadius: '5px',
  // border: '1px solid black',
}
