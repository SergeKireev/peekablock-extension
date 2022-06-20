const b = typeof browser !== 'undefined' ? browser : chrome

function notifyExtension(e) {
  console.log("NOTIFYING", e.detail)
  b.runtime.sendMessage(e.detail);
}

;(function() {
    const container = document.head || document.documentElement;
    const scriptTag = document.createElement('script');
    scriptTag.setAttribute('async', 'false');
    // Inline scripts do not work in MV3 due to more strict security policy
    scriptTag.setAttribute('src', b.runtime.getURL('inpage.js'));
    container.insertBefore(scriptTag, container.children[0]);
    window.addEventListener("transfer-metadata", notifyExtension)
    container.removeChild(scriptTag);
})()
