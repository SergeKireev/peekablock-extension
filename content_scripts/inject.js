const b = typeof browser !== 'undefined' ? browser : chrome

async function notifyExtension(e) {
  const rpcRequest = e.detail;
  const domain = (new URL(window.location)).hostname;
  const message = {
    transaction: rpcRequest.params[0],
    referrer: domain
  }
  setTimeout(() => b.runtime.sendMessage(message), 1000);
}

; (function () {
  const container = document.head || document.documentElement;
  const scriptTag = document.createElement('script');
  scriptTag.setAttribute('async', 'false');
  // Inline scripts do not work in MV3 due to more strict security policy
  scriptTag.setAttribute('src', b.runtime.getURL('inpage.js'));
  container.insertBefore(scriptTag, container.children[0]);
  window.addEventListener("forward-rpc-request", notifyExtension)
  container.removeChild(scriptTag);
})()
