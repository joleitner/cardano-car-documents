import { useUser } from '../hooks/useUser'

export default function Home() {
  const [user, { mutate }] = useUser()

  let name = 'Peter'
  if (user) {
    name = user.firstname
  }

  return <div>hello {name}</div>
}
