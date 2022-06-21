;(function() {
  // your main code here
  const callRequest = () => {
    if (window.ethereum && window.ethereum.isMetaMask) {
      console.log("Found metamasks window.ethereum, proxying it through zephyr")
      const prev = window.ethereum.request
      window.ethereum.request = async (x) => {
        if (x.method === 'eth_sendTransaction') {
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