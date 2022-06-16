import Link from 'next/link'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Spinner from 'react-bootstrap/Spinner'
import Card from 'react-bootstrap/Card'
import { useAsset } from '../hooks/useAsset'
import { usePolicy } from '../hooks/usePolicy'

export default function AssetItem({ assetId }) {
  const { asset, loading } = useAsset(assetId)
  const { policy } = usePolicy(asset?.policy_id)

  if (loading) {
    return (
      <Card style={cardStyle} className="m-3">
        {/* <Card.Img
          variant="top"
          height={265}
          src={getAssetImgAddress(asset)}
          alt={asset.asset_name}
          style={{ borderTopLeftRadius: '10px', borderTopRightRadius: '10px' }}
        /> */}
        <Card.Body className={'text-center'}>
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </Card.Body>
      </Card>
    )
  }

  const getAssetImgAddress = (asset) => {
    const ipfsAddress =
      asset.onchain_metadata[asset.policy_id][asset.asset_name].image
    const httpsAddress = ipfsAddress.replace('ipfs://', 'https://ipfs.io/ipfs/')
    return httpsAddress
  }

  const getOnChainData = (asset) => {
    return asset.onchain_metadata[asset.policy_id][asset.asset_name]
  }

  return (
    <>
      <Card style={cardStyle} className="m-3 shadow-sm">
        <Card.Img
          variant="top"
          height={250}
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
        </Card.Body>
      </Card>
    </>
  )
}

const cardStyle = {
  minWidth: '25rem',
  maxWidth: '25rem',
  borderRadius: '5px',
  // border: '1px solid black',
}
