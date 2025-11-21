export const usePolicyContent = (slug: string) => {
  const getJson = async () => {
    const jsonData = await fetch(`/assets/jsons/policies/${slug}.json`)
    if (!jsonData.ok) {
      return
    }

    return await jsonData.json()
  }

  return {
    getJson
  }
}
