import { ConsolidatedEvent } from "../domain/event"

export function isApprove(events: ConsolidatedEvent[]) {
    return events.find((e: ConsolidatedEvent) => {
        return e.type === 'erc20approval' || e.type === 'erc721approvalForAll' || e.type === 'erc721approval'
    }) != undefined
}

export function isOnlyOut(events: ConsolidatedEvent[]) {
    return events.find((e: ConsolidatedEvent) => {
        return e.direction == 'IN'
    }) == undefined
}
