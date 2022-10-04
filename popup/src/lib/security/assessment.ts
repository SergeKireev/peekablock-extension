import { ConsolidatedApprovalEvent, ConsolidatedEvent } from "../domain/event"

export function isApprove(events: ConsolidatedEvent[]) {
    return events.find((e: ConsolidatedEvent) => {
        return e.type === 'erc20approval' || e.type === 'erc721approvalForAll' || e.type === 'erc721approval'
    }) != undefined
}

function isApprovalEvent(e: ConsolidatedEvent): e is ConsolidatedApprovalEvent {
    return e.type === 'erc20approval' || e.type === 'erc721approvalForAll' || e.type === 'erc721approval'
}

export function findApprove(events: ConsolidatedEvent[]): ConsolidatedApprovalEvent {
    //@ts-ignore
    return events.find((e: ConsolidatedEvent) => {
        return isApprovalEvent(e)
    })
}

export function isOnlyOut(events: ConsolidatedEvent[]) {
    return events.find((e: ConsolidatedEvent) => {
        return e.direction == 'IN'
    }) == undefined
}
