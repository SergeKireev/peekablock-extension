// Have the same dimensions as metamask extension 
const NOTIFICATION_HEIGHT = 620;
const NOTIFICATION_WIDTH = 360;
const MIN_TOP = 10

let _browser = undefined
try {
    _browser = browser ? browser : chrome
} catch {
    _browser = chrome
}

function createWindow(windowOpts) {
    return _browser.windows.create(windowOpts)
}

function updateWindowDimensions(windowId, left) {
    return _browser.windows.update(windowId, { left: left, top: 0 }).catch(e => {
        console.error(e)
    })
}

async function notify(message) {
    console.log("background script received message", message);

    const lastFocused = await _browser.windows.getLastFocused()
    top = lastFocused.top;
    left = lastFocused.left + (lastFocused.width - 3 * NOTIFICATION_WIDTH);

    const urlEncodedQueryS = encodeURI(JSON.stringify(message));
    //TODO: Check compatibility with firefox
    var popupURL = _browser.runtime.getURL(`popup/zephyr.html?qs=${urlEncodedQueryS}`);

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
_browser.runtime.onMessage.addListener(notify);
