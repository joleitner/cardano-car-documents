import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useUser } from '../hooks/useUser'

export default function ProfilePage() {
  const [user, { loading }] = useUser()
  const router = useRouter()

  useEffect(() => {
    // redirect user to login if not authenticated
    if (!loading && !user) router.replace('/login')
  }, [user, loading])

  return (
    <>
      <h1>Profile</h1>

      {user && (
        <>
          <p>Your session:</p>
          <pre>{JSON.stringify(user, null, 2)}</pre>
        </>
      )}
    </>
  )
}
