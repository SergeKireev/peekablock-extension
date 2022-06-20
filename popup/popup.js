const queryString = window.location.search;
console.log(queryString)
const urlParams = new URLSearchParams(queryString);
console.log(urlParams)
const qsJson = urlParams.get('qs')
console.log(decodeURI(qsJson))
const metadata = JSON.parse(decodeURI(qsJson))
const inboundElement = document.getElementById('inbound')
const outboundElement = document.getElementById('outbound')
const approvalsElement = document.getElementById('approvals')
const otherElement = document.getElementById('other')
const ethValueElement = document.getElementById('eth_value')

function buildLinkFromAddress(address) {
    return `<a href="https://etherscan.io/address/${address.address}">${address.label}</a>`
}

function printEvent(evt) {
    if (evt.type === 'erc20transfer') {
        return `Transfer from: ${buildLinkFromAddress(evt.from)}, to: ${buildLinkFromAddress(evt.to)}, amount ${evt.amount} of ${buildLinkFromAddress(evt.token)}`
    } else if (evt.type === 'erc721transfer') {
        return `Transfer from: ${buildLinkFromAddress(evt.from)}, to: ${buildLinkFromAddress(evt.to)}, ${buildLinkFromAddress(evt.token)}: #${evt.tokenId}`
    } else if (evt.type === 'erc20approval') {
        return `Approve from: ${buildLinkFromAddress(evt.from)}, to: ${buildLinkFromAddress(evt.to)}, amount ${evt.amount} of ${buildLinkFromAddress(evt.token)}`
    } else if (evt.type === 'erc721approval') {
        return `Approve from: ${buildLinkFromAddress(evt.from)}, to: ${buildLinkFromAddress(evt.to)}, ${buildLinkFromAddress(evt.token)}: #${evt.tokenId}`
    } else if (evt.type === 'erc721approvalForAll') {
        return `Approve from: ${buildLinkFromAddress(evt.from)}, to: ${buildLinkFromAddress(evt.to)}, all ${buildLinkFromAddress(evt.token)}`
    }
}

const inboundTransfers =
    metadata.erc20Transfers
        .concat(metadata.erc721Transfers)
        .filter(t => t.to.label === 'me')
        .map(t => {
            const transferElement = document.createElement('div')
            transferElement.classList.add('event');
            transferElement.classList.add('inbound');
            transferElement.innerHTML = printEvent(t)
            return transferElement
        })

const outboundTransfers =
    metadata.erc20Transfers
        .concat(metadata.erc721Transfers)
        .filter(t => t.from.label === 'me')
        .map(t => {
            const transferElement = document.createElement('div')
            transferElement.classList.add('event');
            transferElement.classList.add('outbound');
            transferElement.innerHTML = printEvent(t)
            return transferElement
        })

const approvals =
    metadata.erc20Approvals
        .concat(metadata.erc721Approvals)
        .filter(t => t.from.label === 'me')
        .map(t => {
            const transferElement = document.createElement('div')
            transferElement.classList.add('event');
            transferElement.classList.add('outbound');
            transferElement.innerHTML = printEvent(t)
            return transferElement
        })

const otherTransfers = metadata.erc20Transfers
.concat(metadata.erc721Transfers)
.filter(t => t.to.label !== 'me' && t.from.label !== 'me')
.map(t => {
    const transferElement = document.createElement('div')
    transferElement.classList.add('event');
    transferElement.innerHTML = printEvent(t)
    return transferElement
})

console.log("TRANSFERS", inboundTransfers, outboundTransfers, otherTransfers)

inboundTransfers.forEach(x => {
    inboundElement.appendChild(x)
})

outboundTransfers.forEach(x => {
    outboundElement.appendChild(x)
})

approvals.forEach(x => {
    approvalsElement.appendChild(x)
})

otherTransfers.forEach(x => {
    otherElement.appendChild(x)
})

const ethValueChild = document.createElement('div')
ethValueChild.innerHTML = `${metadata.valueDiff} ETH transferred as value`
ethValueElement.appendChild(ethValueChild)