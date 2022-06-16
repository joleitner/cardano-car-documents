import Container from 'react-bootstrap/Container'
import AssetItem from './AssetItem'

export default function AssetList({ assets }) {
  let assetIds = []

  if (!assets) {
    return (
      <Container className="px-3 py-2 border mb-1 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    )
  }

  for (const key in assets) {
    if (typeof assets[key].unit == 'string') {
      // don't put first -> lovelace
      if (key != 0) {
        assetIds.push(assets[key].unit)
      }
    } else {
      assetIds.push(assets[key].unit)
    }
  }
  if (assetIds.length > 0) {
    return (
      <>
        <div className="fw-bold fs-5 my-4">NFTs</div>
        <Container className="p-1 d-flex justify-content-center">
          {assetIds.map((assetId, i) => (
            <AssetItem assetId={assetId} key={i} />
          ))}
        </Container>
      </>
    )
  } else {
    return (
      <Container className="text-center my-3">No NFT's in wallet</Container>
    )
  }
}
