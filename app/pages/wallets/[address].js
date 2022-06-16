import Container from 'react-bootstrap/Container'
import Spinner from 'react-bootstrap/Spinner'
import Alert from 'react-bootstrap/Alert'
import { useUser } from '../../hooks/useUser'
import WalletItem from '../../components/WalletItem'
import PolicyList from '../../components/PolicyList'
import { useRouter } from 'next/router'
import { useWallet } from '../../hooks/useWallet'

export default function Wallet() {
  const router = useRouter()
  const { address } = router.query
  //   const { wallet, loading } = useWallet(walletAddress)

  if (!address) {
    return (
      <Container className="text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    )
  }

  return (
    <>
      <div className="fw-bold fs-5 mb-3">Wallet</div>
      <WalletItem walletId={address} />
    </>
  )
}
