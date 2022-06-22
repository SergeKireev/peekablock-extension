import { generateJazzIcon } from "../display"
import { buildLinkFromAddress } from "./event"

export function shortenAddress(addressStr) {
    return `${addressStr.substring(0, 4)}...${addressStr.substring(addressStr.length-4)}`
}

function createAddressElement(address) {
    const addressElement = document.createElement('div')
    addressElement.classList.add('header_addressItem')
    const icon = generateJazzIcon(address.address)
    icon.classList.add('header_accountIcon')
    addressElement.appendChild(icon)
    const addressText = document.createElement('div')
    addressText.classList.add('header_accountAddress')
    const _address = { label: shortenAddress(address.address), address: address.address }
    addressText.textContent = `${address.label} :`
    addressElement.appendChild(addressText)
    addressElement.appendChild(buildLinkFromAddress(_address))
    return addressElement
}

export function displayHeader(me, target) {
    const meElement = createAddressElement(me)

    const arrow = document.createElement('i')
    arrow.classList.add('fa', 'fa-arrow-right', 'header_arrow')

    const targetElement = createAddressElement(target)

    const header = document.getElementById('header')
    header.appendChild(meElement)
    header.appendChild(arrow)
    header.appendChild(targetElement)
}