import useSWR from 'swr'

export const fetcher = (url) => fetch(url).then((r) => r.json())

export function usePolicy(policyId) {
  const { data, error } = useSWR(`/api/policies/${policyId}`, fetcher)

  return {
    policy: data,
    loading: !error && !data,
    error,
  }
}
