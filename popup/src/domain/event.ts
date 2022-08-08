interface AvgPrice {
    nbPoints: number,
    price: string
}

export interface Address {
    label: string,
    address: string,
    pictureUrl?: string,
    avgPrice?: AvgPrice
}

export interface Event {
    type: 'erc20transfer' | 'erc721transfer' | 'erc1155transfer' | 'erc20approval' | 'erc721approval' | 'erc721approvalForAll'
    token: Address,
    from: Address,
    to: Address
}

export interface Erc20Event extends Event {
    amount: string
}

export interface Erc721Event extends Event {
    tokenId: string
}

export interface ApprovalForAllEvent extends Event {
    amount: string
}
