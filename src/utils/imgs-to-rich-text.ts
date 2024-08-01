export function imgsToRichText(imgs: string[]) {
  let str = '<p>'
  for (const imgSrc of imgs) {
    str += `<img src="${imgSrc}" max-width="100%" width="100%" />`
  }
  str += '<br></p>'
  return str
}
