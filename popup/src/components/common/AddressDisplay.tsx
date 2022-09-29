import { JazzIcon } from "../common/JazzIcon"
import * as React from 'react';
import { LinkFromAddress } from "../common/LinkFromAddress";
import { Address } from "../../lib/domain/event";
import { USER_LABEL } from "../../lib/domain/user";

export function shortenAddress(addressStr: string) {
    if (addressStr.substring(0, 2) != '0x')
        addressStr = `0x${addressStr}`
    return `${addressStr.substring(0, 4)}...${addressStr.substring(addressStr.length - 4)}`
}

export interface AddressDisplayProps {
    address: Address
    message?: string
}

export type Props = React.PropsWithChildren<AddressDisplayProps & React.HTMLProps<void>>

export const AddressDisplay = (props: Props) => {
    const _address = { label: shortenAddress(props.address.address), address: props.address.address }
    return <div className={props.className}>
        <JazzIcon address={props.address} size={32} />
        <LinkFromAddress address={props.address} />
        <div>{props.message}</div>
        {
            props.address.validated ?
                <img className="verified_badge" src={'https://upload.wikimedia.org/wikipedia/commons/e/e4/Twitter_Verified_Badge.svg'} /> :
                undefined
        }
    </div>
}

export const SimpleAddressDisplay = ({ address, size }) => {
    const _address = (
        address.label !== USER_LABEL && address.label !== 'target' ?
            { label: shortenAddress(address.address), address: address.address } :
            address
    )
    return <div className="header_addressItem">
        <JazzIcon address={address} size={size} />
        <LinkFromAddress address={_address} />
    </div>
}
