interface AvgPrice {
    nbPoints: number,
    price: string
}

export interface Address {
    label: string,
    address: string,
    validated?: boolean,
}

export interface Token extends Address {
    pictureUrl?: string,
    avgPrice?: AvgPrice,
    usdPrice?: number
}

export type EventType = 'erc20transfer' | 'erc721transfer' | 'erc1155transfer' | 'erc20approval' | 'erc721approval' | 'erc721approvalForAll'

export interface Event {
    type: EventType, 
    token: Token,
    from: Address,
    to: Address
}

export interface Erc20Event extends Event {
    amount: Amount
}

export interface Erc721Event extends Event {
    tokenId: string
}

export interface ApprovalForAllEvent extends Event {
    amount: string
}

export interface ConsolidatedEvent {
    type: 'erc20transfer' | 'erc721transfer' | 'erc1155transfer' | 'erc20approval' | 'erc721approval' | 'erc721approvalForAll'
    token: Token
    direction: Direction
}

export interface Amount {
    mantissa: string,
    exponent: number
}

export interface ConsolidatedErc20Event extends ConsolidatedEvent {
    amount: Amount
}

export interface ConsolidatedErc721Event extends ConsolidatedEvent {
    tokenId: string
}

export type ConsolidatedApprovalEvent = ConsolidatedErc721ApprovalEvent | ConsolidatedErc721ApprovalForAllEvent | ConsolidatedErc20ApprovalEvent; 

export interface ConsolidatedErc721ApprovalEvent extends ConsolidatedErc721Event {
    tokenId: string
    to: Address
}

export interface ConsolidatedErc721ApprovalForAllEvent extends ConsolidatedErc721Event {
    to: Address
}

export interface ConsolidatedErc20ApprovalEvent extends ConsolidatedErc20Event {
    amount: Amount
    to: Address
}

type Direction = 'IN' | 'OUT'