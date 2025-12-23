export const extractStringPoint = (point: string) => {
  try {
    if (point) {
      const location = point
        .split('POINT')
        .join('')
        .split('(')
        .join('')
        .split(')')
        .join('')
        .split(' ')
      return location
    }
  } catch (err) {}
}

const GOOGLE_MAP_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY;

export const getLocationDetails = async (lat?: number, lng?: number) => {
  try {
    return await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAP_API_KEY}`
    )
      .then((res) => res.json())
      .then((data) => data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const getProfessionTitles = (professions: any): string => {
  const rawProfessions = professions || []
  console.log(rawProfessions)
  try {
    const parsed = rawProfessions.map((prof: any) => JSON.parse(prof))
    const titles = parsed.map((p: { title: string }) => p.title)
    return titles.join(', ')
  } catch (error) {
    return 'Invalid professions data'
  }
}

export const getCurrencySign = () => {}
