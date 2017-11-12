function hideKelvinElements() {
  const el = document.createElement('style')
  el.innerHTML = `
    .kelvin-script {
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

const kelvinScriptContents = new Map()

function updateKelvinScripts() {
  for (const el of document.querySelectorAll('.kelvin-script')) {
    const src = el.getAttribute('src')
    fetch(src).then(response =>
      response.arrayBuffer().then(newContents => {
      const oldContents = kelvinScriptContents.get(src)
      if (!oldContents || !typedArraysEqual(newContents, oldContents)) {
        kelvinScriptContents.set(src, newContents)
        const blobSrc = URL.createObjectURL(new Blob([newContents], {'type': 'text/javascript'}))
        const el = document.createElement('script')
        el.setAttribute('src', blobSrc)
        document.body.append(el)
      }
    }))
  }
}

document.addEventListener("DOMContentLoaded", () => {
  updateKelvinScripts()
})

function updateKelvinScriptsInterval(interval=1000) {
  setInterval(updateKelvinScripts, interval)
}

hideKelvinElements()

var module = module || {};

module.exports = {
  updateKelvinScripts,
  updateKelvinScriptsInterval
};
