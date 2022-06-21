export function buildLinkFromAddress(address) {
    return `<a href="https://etherscan.io/address/${address.address}">${address.label}</a>`
}

function buildAmountLabel(evt) {
    if (evt.type === 'erc20transfer') {
        return `<b>${evt.amount}</b> ${buildLinkFromAddress(evt.token)}`
    } else if (evt.type === 'erc721transfer') {
        return `${buildLinkFromAddress(evt.token)}: #${evt.tokenId}`
    } else if (evt.type === 'erc20approval') {
        return `<b>${evt.amount}</b> ${buildLinkFromAddress(evt.token)}`
    } else if (evt.type === 'erc721approval') {
        return `${buildLinkFromAddress(evt.token)}: #${evt.tokenId}`
    } else if (evt.type === 'erc721approvalForAll') {
        return `${buildLinkFromAddress(evt.token)}: ALL`
    }
}

function buildEventMiddleSection(evt) {
    const middle = document.createElement('div')
    middle.classList.add('event_col', 'event_middle')

    const amount = evt.amount
    const amountSpan = document.createElement('span')
    amountSpan.innerHTML = buildAmountLabel(evt)
    middle.appendChild(amountSpan)

    const arrow = document.createElement('i')
    amountSpan.classList.add('event_middle_arrow')
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
    fromElement.innerHTML = `${buildLinkFromAddress(evt.from)}`
    let description = '';
    
    const descriptionElement = document.createElement('div')
    descriptionElement.innerHTML = description
    eventElement.appendChild(fromElement)
    
    eventElement.appendChild(buildEventMiddleSection(evt))

    const toElement = document.createElement('div')
    toElement.classList.add('event_col')
    toElement.innerHTML = buildLinkFromAddress(evt.to)
    
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
        pillEl.innerHTML = 'APPROVE'
    } else if (evt.from.label === 'me') {
        pillEl.innerHTML = 'OUT'
    } else if (evt.to.label === 'me') {
        pillEl.innerHTML = 'IN'
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