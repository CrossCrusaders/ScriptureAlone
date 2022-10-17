import { Address } from '../Address'

export const formatMillisecondsAsReadableDuration = (durationMs: number) => {

  const msPerSecond = 1000
  const msPerMinute = msPerSecond * 60
  const msPerHour = msPerMinute * 60
  const msPerDay = msPerHour * 24

  let ms = Math.floor(durationMs)
  const days = Math.floor(ms / msPerDay).toString().padStart(2, '0');
  ms = ms % msPerDay

  const hours = Math.floor(ms / msPerHour).toString().padStart(2, '0')
  ms = ms % msPerHour

  const minutes = Math.floor(ms / msPerMinute).toString().padStart(2, '0')
  ms = ms % msPerMinute

  const seconds = Math.floor(ms / msPerSecond).toString().padStart(2, '0')

  if (durationMs > msPerDay) {
    return `${days}:${hours}:${minutes}:${seconds}`
  } else if (durationMs > msPerHour) {
    return `${hours}:${minutes}:${seconds}`
  } else if (durationMs > msPerMinute) {
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  } else if (durationMs > msPerSecond) {
    return `00:${seconds}`
  } else {
    return durationMs + 'ms'
  }
}

export const formatAddress = (addr: Address) => {

  let addressString = ''

  if (addr.streetAddress1)
    addressString += addr.streetAddress1
  if (addr.streetAddress2)
    addressString += ` ${addr.streetAddress2}`
  if (addr.city)
    addressString += ` ${addr.city},`
  if (addr.region)
    addressString += ` ${addr.region},`
  if (addr.postalCode)
    addressString += ` ${addr.postalCode}`

  return addressString
}

export const formatMaxLengthText = (text: string, maxLength: number) => {
  if (text.length < maxLength)
    return text
  return text.substring(0, maxLength - 3) + '...'
}

export const formatName = (firstName: string | any, lastName?: string) => {

  if (!firstName)
    return ''

  if (typeof firstName === 'string') {
    return `${firstName} ${lastName}`.trim()
  }

  const fName = firstName.firstName || firstName.givenName
  const lName = firstName.lastName || firstName.familyName

  return `${fName} ${lName}`.trim()

}