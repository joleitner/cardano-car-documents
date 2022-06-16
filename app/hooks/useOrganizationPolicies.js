import useSWR from 'swr'

export const fetcher = (url) => fetch(url).then((r) => r.json())

export function useOrganizationPolicies(id) {
  const { data, error } = useSWR(`/api/organizations/${id}/policies`, fetcher)

  return {
    policies: data,
    loading: !error && !data,
    error,
  }
}
