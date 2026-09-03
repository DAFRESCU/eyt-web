import { useEffect } from 'react'

function setMetaByName(name, content) {
  let el = document.querySelector(`meta[name="${name}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute('name', name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function setMetaByProperty(property, content) {
  let el = document.querySelector(`meta[property="${property}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute('property', property)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

export default function Seo({ title, description, ogType = 'website' }) {
  useEffect(() => {
    if (title) document.title = title
    if (description) setMetaByName('description', description)
    if (title) setMetaByProperty('og:title', title)
    if (description) setMetaByProperty('og:description', description)
    setMetaByProperty('og:type', ogType)
  }, [title, description, ogType])

  return null
}
