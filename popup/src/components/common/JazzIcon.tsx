import { useRef, useEffect } from 'react'
import * as React from 'react'
import { Address } from '../../lib/domain/event';
const jazzicon = require('@metamask/jazzicon')

export function generateJazzIcon(address: string, size: number) {
    let _address = address.substring(0, 2) === '0x' ? address.substring(2) : address
    const addr = _address.slice(0, 8);
    const seed = parseInt(addr, 16);
    const icon = jazzicon(size, seed);
    return icon
}

export interface JazzIconProps {
    address: Address,
    size: number
}

export const JazzIcon = (props: React.PropsWithChildren<JazzIconProps & React.HTMLProps<void>>) => {
    const ref = useRef();
    useEffect(() => {
        const icon = generateJazzIcon(props.address.address, props.size)
        icon.classList.add('header_accountIcon')
        const current: any = ref.current
        if (current.firstChild)
            current.removeChild(current.lastChild);
        current.appendChild(icon)
    })
    return <div className={props.className} ref={ref} style={{height: props.size}}></div>
}