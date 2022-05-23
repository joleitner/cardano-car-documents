import useSWR from 'swr'

export const fetcher = (url) => fetch(url).then((r) => r.json())

export function useWallet(name) {
  const { data, error } = useSWR(`/api/wallets/${name}`, fetcher)

  return {
    wallet: data,
    loading: !error && !data,
    error,
  }
}
