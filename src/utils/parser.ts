export const fixJSON = (jsonString: string):any => {

  return jsonString.replaceAll('```', '').replace('json', '')

  // try {
  //   let parsedData = JSON.parse(cleanedString)
  //   return parsedData
  // } catch (error) {
  //   console.error('Failed to parse JSON:', error)
  //   return null
  // }
}
