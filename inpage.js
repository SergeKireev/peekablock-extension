;(function() {
  // your main code here
  const callRequest = () => {
    if (window.ethereum && window.ethereum.isMetaMask) {
      console.log("Found metamask's window.ethereum, proxying it through peekablock")
      const prev = window.ethereum.request
      window.ethereum.request = async (rpcRequest) => {
        if (rpcRequest.method === 'eth_sendTransaction') {
          const event = new CustomEvent('forward-rpc-request', {
            detail: rpcRequest
          })  
          window.dispatchEvent(event)
        } 
        return prev(rpcRequest)
      }
    } else {
      setTimeout(() => {
        callRequest()
      }, 3000)
    }
  }
  callRequest()
})()