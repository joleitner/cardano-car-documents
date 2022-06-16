import Link from 'next/link'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Spinner from 'react-bootstrap/Spinner'
import Button from 'react-bootstrap/Button'

export default function PolicyItem({ policy }) {
  return (
    <>
      <Container className="align-items-center px-3 py-2 border mb-1">
        <Row className="align-items-center">
          {/* <Link
          href="/wallets/[address]"
          as={`/wallets/${wallet.address}`}
          passHref
        > */}
          <Col className="col-auto">{policy.policyId}</Col>
          {/* </Link> */}
          <Col>{policy.name}</Col>
          <Col className="col-2 text-end">
            <Link href={`/manage/${policy.policyId}/mint`} passHref>
              <Button variant="outline-dark">Mint NFT</Button>
            </Link>
          </Col>
        </Row>
      </Container>
    </>
  )
}
