export const useParseTextToHtml = () => {
  function replaceUrlsWithLinks(text) {
    const urlRegex = /(https?:\/\/\S+)/g
    const parts = text.split(urlRegex)

    return parts.map((part) => {
      if (urlRegex.test(part)) {
        return h('a', { href: part, target: '_blank', rel: 'noopener noreferrer' }, part)
      } else {
        return part
      }
    })
  }

  function createVNodeFromElement(element: any) {
    if (!element) return null

    if (element.nodeType === 3) {
      // Text node
      return replaceUrlsWithLinks(element.textContent)
    }

    const tag = element.tagName.toLowerCase()
    const children = Array.from(element.childNodes).map(createVNodeFromElement)

    return h(tag, {}, children)
  }

  function parseHtmlStringToVNode(html: string) {
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')

    return Array.from(doc.body.childNodes).map(createVNodeFromElement)
  }

  return {
    parseHtmlStringToVNode
  }
}
