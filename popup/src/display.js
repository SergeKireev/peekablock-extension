const jazzicon = require('@metamask/jazzicon')

export function generateJazzIcon(address, size = 32) {
    let _address = address.substring(0, 2) === '0x' ? address.substring(2) : address
    const addr = _address.slice(0, 8);
    const seed = parseInt(addr, 16);
    const icon = jazzicon(size, seed);
    return icon
}