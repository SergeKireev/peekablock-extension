
const isChrome = typeof chrome !== 'undefined'
const b = typeof browser !== 'undefined' ? browser : chrome

async function notifyExtension(e) {
  console.debug("Notified")
  const rpcRequest = e.detail;
  const domain = (new URL(window.location)).hostname;
  const message = {
    transaction: rpcRequest.params[0],
    referrer: domain
  }
  b.runtime.sendMessage(message);
}; 

(function () {
  console.debug("Content script loaded!")
  window.addEventListener("forward-rpc-request", notifyExtension)
})()