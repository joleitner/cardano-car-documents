import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useUser } from '../hooks/useUser'
import Button from 'react-bootstrap/Button'

export default function ProfilePage() {
  const [user, { loading }] = useUser()
  const router = useRouter()

  const createWallet = () => {
    fetch(`api/wallets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    }).then(async (res) => {
      const wallet = await res.json()
      router.push(`api/wallets/${wallet.name}`)
    })
  }

  useEffect(() => {
    // redirect user to login if not authenticated
    if (!loading && !user) router.replace('/login')
  }, [user, loading])

  return (
    <>
      <h1>Profile</h1>
      <Button variant="dark" onClick={createWallet}>
        Create new Wallet
      </Button>

      {user && (
        <>
          <p>Your session:</p>
          <pre>{JSON.stringify(user, null, 2)}</pre>
        </>
      )}
    </>
  )
}
