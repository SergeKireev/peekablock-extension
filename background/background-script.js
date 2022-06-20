// Have the same dimensions as metamask extension 
const NOTIFICATION_HEIGHT = 620;
const NOTIFICATION_WIDTH = 360;
const MIN_TOP = 10

function createWindow(windowOpts) {
    return browser.windows.create(windowOpts)
}

function updateWindowDimensions(windowId, left) {
    return browser.windows.update(windowId, { left: left, top: 0 }).catch(e => {
        console.error(e)
    })
}

async function notify(message) {
    console.log("background script received message", message);

    const lastFocused = await browser.windows.getLastFocused()
    top = lastFocused.top;
    left = lastFocused.left + (lastFocused.width - 3 * NOTIFICATION_WIDTH);

    const urlEncodedQueryS = encodeURI(JSON.stringify(message));
    var popupURL = browser.extension.getURL(`popup/zephyr.html?qs=${urlEncodedQueryS}`);

    const popupWindow = await createWindow({
        url: popupURL,
        type: 'popup',
        left: left,
        width: NOTIFICATION_WIDTH*2,
        height: NOTIFICATION_HEIGHT
    })

    if (popupWindow.top !== top && popupWindow.state !== 'fullscreen') {
        console.log("UPDATING POPUP ID", popupWindow.id)
        await updateWindowDimensions(popupWindow.id, left, top)
    }
}

/*
Assign `notify()` as a listener to messages from the content script.
*/
browser.runtime.onMessage.addListener(notify);
