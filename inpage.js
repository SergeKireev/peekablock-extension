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

        if (requestArg.method !== 'eth_sendTransaction') {
          return originalCall(...args);
        }

        if (requestArg.params.length !== 1) {
          return originalCall(...args);
        }

        const chainId = await target.request({ method: 'eth_chainId' })
        console.debug("Forwarding transaction")
        const event = new CustomEvent('forward-rpc-request', {
          detail: {
            chainId: chainId,
            ...args[0]
          }
        })
        window.dispatchEvent(event)
        return originalCall(...args);
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