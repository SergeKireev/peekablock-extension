import { useRef, useEffect } from 'react'
import * as React from 'react'
const jazzicon = require('@metamask/jazzicon')

export function generateJazzIcon(address: string, size: number) {
    let _address = address.substring(0, 2) === '0x' ? address.substring(2) : address
    const addr = _address.slice(0, 8);
    const seed = parseInt(addr, 16);
    const icon = jazzicon(size, seed);
    return icon
}

export const JazzIcon = ({ address, size = 32 }) => {
    const ref = useRef();
    useEffect(() => {
        const icon = generateJazzIcon(address.address, size)
        icon.classList.add('header_accountIcon')
        const current: any = ref.current
        if (current.firstChild)
            current.removeChild(current.lastChild);
        current.appendChild(icon)
    })
    return <div ref={ref} style={{height: size}}></div>
}