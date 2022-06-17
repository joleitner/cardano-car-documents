import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useUser } from '../hooks/useUser'
import Button from 'react-bootstrap/Button'
import Spinner from 'react-bootstrap/Spinner'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import WalletItem from '../components/WalletItem'

export default function ProfilePage() {
  const [user, { loading }] = useUser()
  const router = useRouter()

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
      <h1>
        {user?.firstname} {user?.lastname}
      </h1>
      <hr />
      <Container className="mb-4">
        <h3>Wallet</h3>
        <WalletItem walletId={user.walletId} />
      </Container>
    </>
  )
}
