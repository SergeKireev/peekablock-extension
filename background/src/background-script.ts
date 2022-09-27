import { verifyWithContract } from './contract/registry';

// Have the same dimensions as metamask extension 
const NOTIFICATION_HEIGHT = 620;
const METAMASK_NOTIFICATION_WIDTH = 360;
const NOTIFICATION_WIDTH = 720;
const DUMMY_NOTIFICATION_WIDTH = 100;
const MIN_TOP = 10

let _browser = undefined
let isChrome = undefined
try {
    //@ts-ignore
    _browser = browser ? browser : chrome
    isChrome = false
} catch {
    //@ts-ignore
    _browser = chrome
    isChrome = true
}

let currentWindowId = undefined;

function createWindow(windowOpts) {
    return _browser.windows.create(windowOpts)
}

function updateWindowDimensions(windowId, left) {
    return _browser.windows.update(windowId, { left: left, top: 0 }).catch(e => {
        console.error(e)
    })
}

const chromeProperties = isChrome ? {
    world: 'MAIN'
} : {}
const firefoxProperties = !isChrome ? {
    persistAcrossSessions: false,
} : {}

async function attachScripts() {
    let scripts = [
        {
            id: 'Peekablock Script',
            matches: ['http://*/*', 'https://*/*'],
            js: ['inpage.js'],
            allFrames: true,
            runAt: 'document_start',
            ...chromeProperties,
            ...firefoxProperties
        }
    ];

    if (isChrome) {
        await _browser.scripting.unregisterContentScripts()
        scripts.push({
            id: 'Peekablock Content Script',
            matches: ['http://*/*', 'https://*/*'],
            js: ['content_scripts/inject.js'],
            allFrames: true,
            runAt: 'document_start',
        })
    }

    _browser.scripting.registerContentScripts(scripts, (err, data) => {
        console.debug('Registered content scripts');
    });
}

attachScripts().catch((err) => {
    console.debug('Error during attaching scripts', err);
});


async function verifyContract(address) {
    const response = await fetch(`https://peekablock.com/validate/contract?address=${address}`)
    const data = await response.json();
    if (data.status === 'ok') {
        const result = data.data;
        const verifiedWithCommitment = await verifyWithContract(result.address, result.org, result.name, result.proof); 
        if (verifiedWithCommitment) {
            return data.data;
        }
        return undefined;
    }
    return undefined;
}

async function classifyAction(transactionData: string) {
    const response = await fetch(`https://peekablock.com/action?method_sig=${transactionData}`)
    const data = await response.json();
    if (data.status === 'ok') {
        const result = data.action;
        return result;
    }
    return undefined;
}

async function runSimulation(message) {
    const lastFocused = await _browser.windows.getLastFocused()
    let top = lastFocused.top;
    let metamask_left = lastFocused.left + lastFocused.width - METAMASK_NOTIFICATION_WIDTH;
    let left = metamask_left - NOTIFICATION_WIDTH;

    const urlEncodedQueryS = encodeURI(JSON.stringify(message.transaction));
    const referrer = encodeURI(message.referrer)
    const chainId = encodeURI(message.chainId)
    //TODO: Check compatibility with firefox
    var popupURL = _browser.runtime.getURL(`popup/peekablock.html?transaction=${urlEncodedQueryS}&referrer=${referrer}&chain_id=${chainId}`);

    const popupWindow = await createWindow({
        url: popupURL,
        type: 'popup',
        left: left,
        width: NOTIFICATION_WIDTH,
        height: NOTIFICATION_HEIGHT
    })
    currentWindowId = popupWindow.id;

    //Open a dummy window for metamask to take as a reference and open itself correctly
    const popupWindow2 = await createWindow({
        url: ``,
        type: 'popup',
        left: metamask_left,
        width: METAMASK_NOTIFICATION_WIDTH,
        height: NOTIFICATION_HEIGHT
    })

    if (popupWindow2.top !== top) {
        await updateWindowDimensions(popupWindow2.id, metamask_left)
    }
    //Close the dummy window after a safety timeout
    setTimeout(() => {
        _browser.windows.remove(popupWindow2.id).catch(e => {})
    }, 1000)

    if (popupWindow.top !== top && popupWindow.state !== 'fullscreen') {
        updateWindowDimensions(popupWindow.id, left)
    }
}
function notify(message, sender, sendResponse) {

    if (message.isFinished && currentWindowId) {
        _browser.windows.remove(currentWindowId).catch(e => {});
        currentWindowId = undefined;
        return;
    }

    if (message.validateContract) {
        const address = message.validateContract.address;
        verifyContract(address).then(response => {
            sendResponse(response);
        })
        return true;
    }

    if (message.classifyAction) {
        const methodSig = message.classifyAction.methodSig;
        classifyAction(methodSig).then(response => {
            sendResponse(response);
        })
        return true;
    }

    runSimulation(message);
}

/*
Assign `notify()` as a listener to messages from the content script.
*/
_browser.runtime.onMessage.addListener(notify);
