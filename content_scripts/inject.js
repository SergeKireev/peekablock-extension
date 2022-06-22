const b = typeof browser !== 'undefined' ? browser : chrome

async function notifyExtension(e) {
  console.log("NOTIFYING", e.detail)
  const rpcRequest = e.detail;

  const response = await fetch(`https://peekablock.com/`, {
    method: 'POST',
    body: JSON.stringify(rpcRequest.params[0]),
    headers: {
      'content-type': 'application/json'
    }
  }).catch(e => {
    console.error(e)
    return undefined
  })
  const responseBody = await response.json().catch(console.error)
  console.log("GOT RESPONSE", JSON.stringify(responseBody))
  setTimeout(() => b.runtime.sendMessage(responseBody), 1000);
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
