import React from "react"
import { Address, ConsolidatedEvent, Event } from "../../../../lib/domain/event"
import { AddressDisplay } from "../../../common/AddressDisplay"
import { AssetComponent } from "../event/asset/Asset"

type Direction = 'IN' | 'OUT'

export interface EventRowDetailsProps {
    actor: Address
    direction: Direction
    event: Event
    chainId: number
}

const isApprovalEvent = (event: Event) => {
    return event.type === 'erc20approval' || event.type === 'erc721approval' || event.type === 'erc721approvalForAll'
}

function adaptToOneLeg(event: Event, direction: Direction): ConsolidatedEvent {
    return {
        ...event,
        direction: direction
    }
}

export const EventRowDetails = (props: EventRowDetailsProps) => {
    let message = props.direction === 'OUT' ? 'sending' : 'receiving'
    if (isApprovalEvent(props.event)) {
        message = props.direction === 'OUT' ? 'approving' : 'approved for'
    }

    return <div className='event_row_details'>
        <AddressDisplay
            className='new_transaction_details_event_address_display'
            address={props.actor}
            message={message}
        />
        <div className="new_transaction_event_middle_section">
            <div className="event_row_details_middle_col">
                <div className="event_row_details_middle_row">
                    <AssetComponent
                        chainId={props.chainId}
                        event={adaptToOneLeg(props.event, props.direction)}
                        actor={props.actor}
                    />
                </div>
            </div>
        </div>
    </div>
}