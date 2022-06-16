import useSWR from 'swr'

export const fetcher = (url) => fetch(url).then((r) => r.json())

export function useAsset(assetId) {
  const { data, error } = useSWR(`/api/nfts/${assetId}`, fetcher)

  return {
    asset: data,
    loading: !error && !data,
    error,
  }
}
