export function customSplit(str: string, symbol = ',') {
  if (!str) {
    return []
  }
  return str.split(symbol)
}
