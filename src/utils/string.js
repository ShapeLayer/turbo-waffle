const entityCharToNormalChar = (text) => {
  return text
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&nbsp;', ' ')
    .replaceAll('&amp;', '&')
    .replaceAll('&quot;', '"')
}

const removeFsReserved = (text) => {
  return text
    .replaceAll('/', '')
    .replaceAll('<', '')
    .replaceAll('>', '')
    .replaceAll(':', '')
    .replaceAll('"', '')
    .replaceAll('\\', '')
    .replaceAll('|', '')
    .replaceAll('?', '')
    .replaceAll('*', '')
}

export { entityCharToNormalChar, removeFsReserved }
