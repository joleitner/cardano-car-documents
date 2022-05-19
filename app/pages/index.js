import { useUser } from '../hooks/useUser'

export default function Home(req, res) {
  const [user] = useUser()

  let name = ''
  if (user) {
    name = user.firstname
  }

  return <div>hello {name}</div>
}
