;(function() {
  // your main code here
  const callRequest = () => {
    if (window.ethereum && window.ethereum.isMetaMask) {
      console.log("Found metamasks window.ethereum, replacing with console.log")
      const prev = window.ethereum.request
      window.ethereum.request = async (x) => {
        const activeAccount = window.ethereum.selectedAddress
        if (x.method === 'eth_sendTransaction') {
          const payload = {
            activeAccount: activeAccount,
            params: x.params[0]
          }
          console.log("PAYLOAD", payload, x)
          const response = await fetch(`http://localhost:3000`, {
            method: 'POST',
            body: JSON.stringify(x.params[0]),
            headers: {
              'content-type': 'application/json'
            }
          }).catch(console.error)
          const responseBody = await response.json()
          console.log("GOT RESPONSE", JSON.stringify(responseBody))
          const event = new CustomEvent('transfer-metadata', {
            detail: responseBody
          });
          setTimeout(() => window.dispatchEvent(event), 1000)
        } 
        return prev(x)
      }
    } else {
      setTimeout(() => {
        callRequest()
      }, 3000)
    }
  }
  callRequest()
})()