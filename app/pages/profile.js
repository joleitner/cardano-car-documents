import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useUser } from '../hooks/useUser'
import Button from 'react-bootstrap/Button'
import Spinner from 'react-bootstrap/Spinner'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import WalletList from '../components/WalletList'
import Container from 'react-bootstrap/Container'

export default function ProfilePage() {
  const [user, { loading }] = useUser()
  const router = useRouter()

  const createWallet = () => {
    fetch(`/api/wallets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    }).then(async (res) => {
      const wallet = await res.json()
      // router.push(`/api/wallets/${wallet.name}`)
    })
  }

  useEffect(() => {
    // redirect user to login if not authenticated

    if (!loading && !user) router.replace('/login')
  }, [user, loading])

  if (loading) {
    return (
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    )
  }

  return (
    <>
      <h1>Profile</h1>
      <hr />
      <Container className="mb-4">
        <h3>Wallets</h3>
        <WalletList wallets={user.wallets} />
        <Row className="justify-content-center mt-3">
          <Col className="col-auto">
            <Button variant="dark" className="px-4" onClick={createWallet}>
              Create new Wallet
            </Button>
          </Col>
        </Row>
      </Container>
      <hr />
      <Container className="">
        <h3>NFTs</h3>
      </Container>
    </>
  )
}
