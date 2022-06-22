export function buildLinkFromAddress(address) {
    const linkEl = document.createElement('a')
    linkEl.classList.add('linkAddress')
    linkEl.href = `https://etherscan.io/address/${address.address}`
    linkEl.textContent = address.label
    return linkEl
}

function attachAmountLabel(evt, middleEl) {
    const amountSpan = document.createElement('span')
    const tokenLink = buildLinkFromAddress(evt.token)
    if (evt.type === 'erc20transfer' || evt.type === 'erc20approval') {
        amountSpan.textContent = `${evt.amount} `
        middleEl.appendChild(amountSpan)
        middleEl.appendChild(tokenLink)
    } else if (evt.type === 'erc721transfer' || evt.type === 'erc721approval') {
        amountSpan.textContent = `: #${evt.tokenId}`
        middleEl.appendChild(tokenLink)
        middleEl.appendChild(amountSpan)
    } else if (evt.type === 'erc721approvalForAll') {
        amountSpan.textContent = `: ALL`
        middleEl.appendChild(tokenLink)
        middleEl.appendChild(amountSpan)
    }
}

function buildEventMiddleSection(evt) {
    const middle = document.createElement('div')
    middle.classList.add('event_col', 'event_middle')

    attachAmountLabel(evt, middle)

    const arrow = document.createElement('i')
    arrow.classList.add('event_middle_arrow')
    arrow.classList.add('fa', 'fa-arrow-right', 'header_arrow')
    middle.appendChild(arrow)

    return middle
}

/**
 * 
 * @param eventElement
 * @param evt
 * @returns list of components to append
 */
function displayEvent(eventElement, evt) {
    const fromElement = document.createElement('div')
    fromElement.classList.add('event_col')
    fromElement.appendChild(buildLinkFromAddress(evt.from))
    eventElement.appendChild(fromElement)
    
    eventElement.appendChild(buildEventMiddleSection(evt))

    const toElement = document.createElement('div')
    toElement.classList.add('event_col')
    toElement.appendChild(buildLinkFromAddress(evt.to))

    eventElement.appendChild(toElement)
}

function createPill(evt) {
    const pillEl = document.createElement('span')
    pillEl.classList.add('event_pill')
    if (evt.from.label === 'me' &&
        (evt.type === 'erc20approval'
            || evt.type === 'erc721approval'
            || evt.type === 'erc721approvalForAll')
    ) {
        pillEl.textContent = 'APPROVE'
    } else if (evt.from.label === 'me') {
        pillEl.textContent = 'OUT'
    } else if (evt.to.label === 'me') {
        pillEl.textContent = 'IN'
    } else {
        return undefined
    }
    return pillEl
}

export function createEventElement(event) {
    const eventElement = document.createElement('div')
    eventElement.classList.add('event');
    if (event.from.label === 'me')
        eventElement.classList.add('outbound');
    if (event.to.label === 'me')
        eventElement.classList.add('inbound');
    eventElement.appendChild(createPill(event))
    displayEvent(eventElement, event)
    return eventElement
}