
const isChrome = typeof chrome !== 'undefined'
const b = typeof browser !== 'undefined' ? browser : chrome

async function notifyInitiateTransaction(e) {
  const rpcRequest = e.detail;
  const domain = (new URL(window.location)).hostname;
  const message = {
    transaction: rpcRequest.params[0],
    chainId: rpcRequest.chainId,
    referrer: domain
  }
  b.runtime.sendMessage(message);
};

async function notifyInitiateSignTyped(e) {
  const rpcRequest = e.detail;
  const domain = (new URL(window.location)).hostname;
  const message = {
    address: rpcRequest.params[0],
    signTypedData: rpcRequest.params[1],
    referrer: domain
  }
  b.runtime.sendMessage(message);
};

async function notifyTransactionFinished(e) {
  const transactionSigned = e.detail;
  const message = {
    isFinished: true,
    transactionSigned: transactionSigned
  }
  b.runtime.sendMessage(message);
}

(function () {
  console.debug("Content script loaded!")
  window.addEventListener("initiate-transaction", notifyInitiateTransaction)
  window.addEventListener("initiate-sign-typed", notifyInitiateSignTyped)
  window.addEventListener("finished-transaction", notifyTransactionFinished)
})()