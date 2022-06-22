import { createEventElement } from './components/event';
import { displayHeader } from './components/header';

function adaptEthValueToTransferEvent(value, me, target) {
    return {
        "type": "erc20transfer",
        "token": { "label": "Ethereum", "address": "0x0" },
        "from": me,
        "to": target,
        "amount": value
    }
}
function transferListElement(metadata) {
    const transfersElement = document.createElement('div')

    const transfersTitle = document.createElement('div')
    transfersTitle.classList.add('title')
    transfersTitle.innerHTML = 'Transfers'
    transfersElement.appendChild(transfersTitle)

    const transfers =
        metadata.erc20Transfers
            .concat(metadata.erc721Transfers)
            .map(createEventElement)

    if (metadata.valueDiff !== '0,00000' && metadata.valueDiff !== '0') {
        const ethTransfer = adaptEthValueToTransferEvent(metadata.valueDiff, metadata.me, metadata.target)
        const ethTransferEl = createEventElement(ethTransfer)
        transfers.push(ethTransferEl)
    }

    transfers.forEach(x => {
        transfersElement.appendChild(x)
    })

    if (transfers.length > 0) {
        return transfersElement
    } else {
        return undefined
    }
}

function otherTransferListElement(metadata) {
    const otherElement = document.createElement('div')

    const otherTransfersTitle = document.createElement('div')
    otherTransfersTitle.classList.add('title')
    otherTransfersTitle.innerHTML = 'Other transfers'
    otherElement.appendChild(otherTransfersTitle)

    const otherTransfers = metadata.erc20Transfers
        .concat(metadata.erc721Transfers)
        .filter(t => t.to.label !== 'me' && t.from.label !== 'me')
        .map(event => {
            return createEventElement(event)
        })
    otherTransfers.forEach(x => {
        otherElement.appendChild(x)
    })
    if (otherTransfers.length > 0) {
        return otherElement
    } else {
        return undefined
    }
}

function approvalListElement(metadata) {
    const approvalsElement = document.createElement('div')

    const approvalsTitle = document.createElement('div')
    approvalsTitle.classList.add('title')
    approvalsTitle.innerHTML = 'Approvals'
    approvalsElement.appendChild(approvalsTitle)

    const approvals =
        metadata.erc20Approvals
            .concat(metadata.erc721Approvals)
            .map(createEventElement)
    approvals.forEach(x => {
        approvalsElement.appendChild(x)
    })
    if (approvals.length > 0) {
        return approvalsElement
    } else {
        return undefined
    }
}

function displayEvents(metadata) {
    const transferEl = transferListElement(metadata)
    const approvalEl = approvalListElement(metadata)
    const otherTransferEl = otherTransferListElement(metadata)

    const containerEl = document.getElementById('container')
    transferEl && containerEl.appendChild(transferEl)
    approvalEl && containerEl.appendChild(approvalEl)
    otherTransferEl && containerEl.appendChild(otherTransferEl)

}

function displayError(metadata) {
    const errorEl = document.createElement('div')
    errorEl.classList.add('error_container')
    const icon = `<i class="fa fa-times error_icon" aria-hidden="true"></i>`
    errorEl.innerHTML = `${icon} ${metadata.msg}`
    const containerEl = document.getElementById('container')
    containerEl.appendChild(errorEl)
}

export const setupUi = () => {
    const queryString = window.location.search;
    console.log(queryString)
    const urlParams = new URLSearchParams(queryString);
    console.log(urlParams)
    const qsJson = urlParams.get('qs')
    console.log(decodeURI(qsJson))
    const metadata = JSON.parse(decodeURI(qsJson))

    const me = metadata.me
    const target = metadata.target
    displayHeader(me, target)

    if (metadata.type === 'ok') {
        displayEvents(metadata)
    } else {
        displayError(metadata)
    }
}