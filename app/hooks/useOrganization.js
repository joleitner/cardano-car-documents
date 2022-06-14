import useSWR from 'swr'

export const fetcher = (url) => fetch(url).then((r) => r.json())

export function useOrganization(id) {
  const { data, error } = useSWR(`/api/organizations/${id}`, fetcher)

  return {
    organization: data,
    loading: !error && !data,
    error,
  }
}
