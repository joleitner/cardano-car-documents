import useSWR from 'swr'

export const fetcher = (url) => fetch(url).then((r) => r.json())

export function useWallet(id) {
  const { data, error } = useSWR(`/api/wallets/${id}`, fetcher)

  return {
    wallet: data,
    loading: !error && !data,
    error,
  }
}
