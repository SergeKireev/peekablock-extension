import React from 'react'
import { SignTypedData } from '../../../lib/domain/sign_typed'
import { AddressDisplay, shortenAddress } from '../../common/AddressDisplay'

interface SignTypedProps {
    signTyped: SignTypedData
    referrer: string
    reportScam: () => void
}

export const SignTyped = (props: SignTypedProps) => {
    const address = {
        address: props.signTyped.domain.verifyingContract,
        label: shortenAddress(props.signTyped.domain.verifyingContract)
    }
    return <div className='new_content_box'>
        <div className='new_sign_typed_container'>
            <div>
                The website is asking to sign a message which can be used on the contract:
            </div>
            <AddressDisplay
                className='new_sign_typed_address_display'
                address={address}
                withTooltip='outward'
            />
        </div>
    </div>
}