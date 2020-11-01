// converts [r, g, b] into hex string
export function rgbToHex(color) {
  return'#' + color.map(x => {
    const hex = x.toString(16)
    return (hex.length === 1 ? '0' + hex : hex)
  }).join('')
}