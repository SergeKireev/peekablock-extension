(function () {

  console.debug('Loading in page script')

  let currentProvider;
  if (!window.ethereum) {
    window.ethereum = {}
  }
  currentProvider = window.ethereum;
  let providerChanged = true;

  const peekablockProxyHandler = {
    get(target, prop, receiver) {
      if (prop === 'providers') {
        return null;
      }

      if (prop !== 'request' && prop !== 'send' && prop !== 'sendAsync') {
        return Reflect.get(target, prop, receiver);
      }

      const originalCall = Reflect.get(target, prop, receiver);

      return async (...args) => {
        const requestArg = args[0];

        if (requestArg.method != 'eth_sendTransaction') {
          console.log(requestArg.method)
        }
  
        if (requestArg.method === 'eth_signTypedData_v4') {
          const event = new CustomEvent('initiate-sign-typed', {
            detail: {
              ...requestArg
            }
          })
          window.dispatchEvent(event)
          return originalCall(...args);
        } else if (requestArg.method === 'eth_sendTransaction') {
          if (requestArg.params.length !== 1) {
            return originalCall(...args);
          }

          const chainId = await target.request({ method: 'eth_chainId' })
          console.debug("Forwarding transaction")
          const event = new CustomEvent('initiate-transaction', {
            detail: {
              chainId: chainId,
              ...requestArg
            }
          })
          window.dispatchEvent(event)

          return originalCall(...args).then(x => {
            const transactionFinishedEvent = new CustomEvent('finished-transaction', {
              detail: {
                transactionSigned: true
              }
            })
            console.debug("Transaction signed")
            window.dispatchEvent(transactionFinishedEvent);
            return x;
          }).catch(e => {
            const transactionFinishedEvent = new CustomEvent('finished-transaction', {
              detail: {
                transactionSigned: false
              }
            })
            console.debug("Transaction cancelled")
            window.dispatchEvent(transactionFinishedEvent);
            throw e;
          });
        } else {
          return originalCall(...args);
        }
      };
    },
  };

  Object.defineProperty(window, 'ethereum', {
    get() {
      if (providerChanged) {
        cachedProxy = new Proxy(currentProvider, peekablockProxyHandler);
        providerChanged = false;
      }
      return cachedProxy;
    },
    set(newProvider) {
      providerChanged = true;
      currentProvider = newProvider;
    },
    configurable: false,
  });
})()