import { Amount, ConsolidatedEvent, Event } from "./event"

export function isOk(res: Result): res is SimulationResult {
    return res.type === 'ok';
}

export function isNok(res: Result): res is ErrorResult {
    return res.type === 'nok';
}

export interface Result {
    type: 'nok' | 'ok'
}

export interface ErrorResult {
    type: 'nok',
    msg: string
}

export type Category = 'SWAP' | 'STAKE' | 'MINT' | 'SEND'

export interface SimulationResult {
    type: 'ok',
    category: Category,
    valueDiff: string,
    gasSpent: Amount,
    ethereumPrice: number,
    consolidated: ConsolidatedEvent[]
    erc20Transfers: Event[]
    erc721Transfers: Event[]
    erc20Approvals: Event[]
    erc721Approvals: Event[]
    allEvents: Event[]
}