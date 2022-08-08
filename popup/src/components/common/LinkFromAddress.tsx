import * as React from 'react'
import { Address } from '../../domain/event'

export const LinkFromAddress = ({ address }: { address: Address }) => {
    return <a href={`https://etherscan.io/address/${address.address}`} className="linkAddress">{address.label}</a>
}
