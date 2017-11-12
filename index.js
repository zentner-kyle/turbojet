function hideTurbojetElements() {
  const el = document.createElement('style')
  el.innerHTML = `
    .turbojet-script {
      display: none;
    }
  `
  document.head.appendChild(el)
}

function typedArraysEqual(a, b) {
  if (a.byteLength !== b.byteLength) {
    return false
  }

  for (let i = 0; i < a.byteLength; i++) {
    if (a[i] !== b[i]) {
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

document.addEventListener("DOMContentLoaded", () => {
  updateTurbojetScripts()
})

function updateTurbojetScriptsInterval(interval=1000) {
  setInterval(updateTurbojetScripts, interval)
}

hideTurbojetElements()

var module = module || {};

module.exports = {
  updateScripts: updateTurbojetScripts,
  updateScriptsInterval: updateTurbojetScriptsInterval
};
