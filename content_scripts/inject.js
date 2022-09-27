
const isChrome = typeof chrome !== 'undefined'
const b = typeof browser !== 'undefined' ? browser : chrome

async function notifyExtension(e) {
  console.debug("Notified")
  const rpcRequest = e.detail;
  const domain = (new URL(window.location)).hostname;
  const message = {
    transaction: rpcRequest.params[0],
    chainId: rpcRequest.chainId,
    referrer: domain
  }
  b.runtime.sendMessage(message);
}; 

async function notifyTransactionFinished(e) {
  console.debug("Notified finish")
  const transactionSigned = e.detail;
  const message = {
    isFinished: true,
    transactionSigned: transactionSigned
  }
  b.runtime.sendMessage(message);
}

(function () {
  console.debug("Content script loaded!")
  window.addEventListener("initiate-transaction", notifyExtension)
  window.addEventListener("finished-transaction", notifyTransactionFinished)
})()