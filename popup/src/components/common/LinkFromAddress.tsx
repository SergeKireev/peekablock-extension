import * as React from 'react'
import { Address } from '../../lib/domain/event'
import { StyledLinkButton } from './button/StyledLinkButton'

interface LinkFromAddressProps {
    address: Address
}

export const LinkFromAddress = (props: React.HTMLProps<void> & LinkFromAddressProps) => {
    return <StyledLinkButton link={`https://etherscan.io/address/${props.address.address}`}>
        <div className="linkAddress">
            <span>
                {props.address.label}
            </span>
        </div>
    </StyledLinkButton>
}
