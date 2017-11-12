function hideTurbojetElements() {
  const el = document.createElement('style')
  el.innerHTML = `
    .turbojet-script {
      display: none;
    }
    .turbojet-style {
      display: none;
    }`

  document.head.appendChild(el)
}

function typedArraysEqual(a, b) {
  if (a.byteLength !== b.byteLength) {
    return false
  }

  const aView = new Uint8Array(a);
  const bView = new Uint8Array(b);

  for (let i = 0; i < aView.length; i++) {
    if (aView[i] !== bView[i]) {
      return false
    }
  }

  return true
}

const turbojetScriptContents = new Map()

function updateTurbojetScripts() {
  for (const el of document.querySelectorAll('.turbojet-script')) {
    const src = el.getAttribute('src')
    fetch(src).then(response =>
      response.arrayBuffer().then(newContents => {
      const oldContents = turbojetScriptContents.get(src)
      if (!oldContents || !typedArraysEqual(newContents, oldContents)) {
        turbojetScriptContents.set(src, newContents)
        const blobSrc = URL.createObjectURL(new Blob([newContents], {'type': 'text/javascript'}))
        const el = document.createElement('script')
        el.setAttribute('src', blobSrc)
        document.body.append(el)
      }
    }))
  }
}

function updateTurbojetScriptsInterval(interval=1000) {
  setInterval(updateTurbojetScripts, interval)
}

const turbojetStyleContents = new Map()
const turbojetStyleElements = new Map()

function updateTurbojetStyles() {
  for (const el of document.querySelectorAll('.turbojet-style')) {
    const src = el.getAttribute('src')
    fetch(src).then(response =>
      response.arrayBuffer().then(newContents => {
      const oldContents = turbojetStyleContents.get(src)
      if (!oldContents || !typedArraysEqual(newContents, oldContents)) {
        turbojetStyleContents.set(src, newContents)
        const blobSrc = URL.createObjectURL(new Blob([newContents], {'type': 'text/css'}))
        let el = turbojetStyleElements.get(src)
        if (!el) {
          el = document.createElement('link')
          el.setAttribute('rel', 'stylesheet')
          el.setAttribute('href', blobSrc)
          turbojetStyleElements.set(src, el)
          document.body.append(el)
        } else {
          el.setAttribute('href', blobSrc)
        }
      }
    }))
  }
}

function updateTurbojetStylesInterval(interval=1000) {
  setInterval(updateTurbojetStyles, interval)
}

document.addEventListener("DOMContentLoaded", () => {
  updateTurbojetStyles()
  updateTurbojetScripts()
})

var module = module || {}

module.exports = {
  updateScripts: updateTurbojetScripts,
  updateScriptsInterval: updateTurbojetScriptsInterval,
  updateStyles: updateTurbojetStyles,
  updateStylesInterval: updateTurbojetStylesInterval
}

hideTurbojetElements()
