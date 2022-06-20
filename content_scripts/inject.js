function notifyExtension(e) {
  console.log("NOTIFYING", e.detail)
  browser.runtime.sendMessage(e.detail);
}
;(function() {
    const b = typeof browser !== 'undefined' ? browser : chrome
    console.log("TYPE OF BROWSER", typeof browser)
    const script = document.createElement('script')
    script.src = b.runtime.getURL('./content_scripts/script.js')
    document.documentElement.appendChild(script)
    window.addEventListener("transfer-metadata", notifyExtension);
})()
console.log("LOADING")
