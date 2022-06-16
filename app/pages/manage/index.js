import Link from 'next/link'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Spinner from 'react-bootstrap/Spinner'
import Alert from 'react-bootstrap/Alert'
import { Formik } from 'formik'
import { useUser } from '../../hooks/useUser'
import { useOrganization } from '../../hooks/useOrganization'
import WalletItem from '../../components/WalletItem'
import PolicyList from '../../components/PolicyList'

export default function ManageOrganization() {
  const [user] = useUser()
  const { organization, loading } = useOrganization(user?.organizationId)

  if (loading) {
    return (
      <Container className="text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    )
  }
  if (user?.organizationId == null) {
    return (
      <Container className={'w-75 mb-5'}>
        <Alert variant="danger" className="text-center">
          Unauthorized
        </Alert>
      </Container>
    )
  }

  return (
    <>
      <h2 className="mb-5">Manage - {organization.name}</h2>
      <div className="fw-bold fs-5 mb-3">Wallet</div>
      <WalletItem walletId={organization.walletId} />
      <hr />
      <div className="fw-bold fs-5 mb-3">Policies</div>
      <PolicyList organizationId={organization.id} />
      {/* <hr />
      <Container className={'w-75 mb-5'}>
        <Container className={'mt-5'}>
          <Row>
            <Col className={'text-center'}>
              <Link href="/manage/create" passHref>
                <Button variant="outline-dark">Create</Button>
              </Link>
            </Col>
            <Col className={'text-center'}>
              <Link href="/manage/modify" passHref>
                <Button variant="outline-dark">Modify</Button>
              </Link>
            </Col>
          </Row>
        </Container>
      </Container> */}
    </>
  )
}
