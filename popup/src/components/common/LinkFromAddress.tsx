import * as React from 'react'
import { Address } from '../../lib/domain/event'

interface LinkFromAddressProps {
    address: Address
}

export const LinkFromAddress = (props: React.HTMLProps<void> & LinkFromAddressProps) => {
    return <a href={`https://etherscan.io/address/${props.address.address}`} className="linkAddress">
        <span>
            {props.address.label}
        </span>
    </a>
}
