// Have the same dimensions as metamask extension 
const NOTIFICATION_HEIGHT = 620;
const METAMASK_NOTIFICATION_WIDTH = 360;
const NOTIFICATION_WIDTH = 720;
const DUMMY_NOTIFICATION_WIDTH = 100;
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
    const lastFocused = await _browser.windows.getLastFocused()
    top = lastFocused.top;
    metamask_left = lastFocused.left + lastFocused.width - METAMASK_NOTIFICATION_WIDTH;
    left = metamask_left - NOTIFICATION_WIDTH;

    const urlEncodedQueryS = encodeURI(JSON.stringify(message.transaction));
    const referrer = encodeURI(message.referrer)
    //TODO: Check compatibility with firefox
    var popupURL = _browser.runtime.getURL(`popup/peekablock.html?transaction=${urlEncodedQueryS}&referrer=${referrer}`);

    const popupWindow = await createWindow({
        url: popupURL,
        type: 'popup',
        left: left,
        width: NOTIFICATION_WIDTH,
        height: NOTIFICATION_HEIGHT
    })

    //Open a dummy window for metamask to take as a reference and open itself correctly
    const popupWindow2 = await createWindow({
        url: ``,
        type: 'popup',
        left: metamask_left,
        width: METAMASK_NOTIFICATION_WIDTH,
        height: NOTIFICATION_HEIGHT
    })

    if (popupWindow2.top !== top) {
        await updateWindowDimensions(popupWindow2.id, metamask_left, top)
    }
    //Close the dummy window after a safety timeout
    setTimeout(() => {
        _browser.windows.remove(popupWindow2.id)
    }, 1000)

    if (popupWindow.top !== top && popupWindow.state !== 'fullscreen') {
        updateWindowDimensions(popupWindow.id, left, top)
    }
}

/*
Assign `notify()` as a listener to messages from the content script.
*/
_browser.runtime.onMessage.addListener(notify);
