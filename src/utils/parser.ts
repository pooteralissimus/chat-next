import { jsonrepair } from 'jsonrepair'

export const fixJSON = (jsonString: string): any => {
  const sub = '{' + jsonString.substring(3)

  try {
    const repaired = jsonrepair(sub)
    return JSON.parse(repaired)
  } catch (error) {
    console.error('Failed to parse JSON:', error)
    return null
  }
}
