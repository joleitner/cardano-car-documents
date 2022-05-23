import useSWR from 'swr'

export const fetcher = (url) => fetch(url).then((r) => r.json())

export function useUser() {
  const { data, mutate, error } = useSWR('/api/auth/user', fetcher)
  // if data is not defined, the query has not completed

  const loading = !error && !data
  const user = data
  return [user, { mutate, loading }]
}
