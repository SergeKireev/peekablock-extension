import { JazzIcon } from "../common/JazzIcon"
import * as React from 'react';
import { LinkFromAddress } from "../common/LinkFromAddress";

export function shortenAddress(addressStr: string) {
    if (addressStr.substring(0, 2) != '0x')
        addressStr = `0x${addressStr}`
    return `${addressStr.substring(0, 4)}...${addressStr.substring(addressStr.length - 4)}`
}

const AddressText = ({ address }) => {
    return <div className="header_accountAddress">
        {`${address.label} :`}
    </div>
}

export const AddressDisplay = ({ address }) => {
    const _address = { label: shortenAddress(address.address), address: address.address }
    return <div className="header_addressItem">
        <JazzIcon address={address} />
        <AddressText address={address} />
        <LinkFromAddress address={_address} />
    </div>
}

export const SimpleAddressDisplay = ({ address, size }) => {
    const _address = (
        address.label !== 'me' && address.label !== 'target' ?
            { label: shortenAddress(address.address), address: address.address } :
            address
    )
    return <div className="header_addressItem">
        <JazzIcon address={address} size={size} />
        <LinkFromAddress address={_address} />
    </div>
}
