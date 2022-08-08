import { ApprovalForAllEvent, Erc20Event, Erc721Event, Event } from "../../domain/event"
import * as React from 'react'
import { LinkFromAddress } from "../common/LinkFromAddress"
import { SimpleAddressDisplay } from "../common/AddressDisplay"

function isErc20Event(event: Event): event is Erc20Event {
    return event.type === 'erc20transfer' || event.type === 'erc20approval'
}

function isErc721Event(event: Event): event is Erc721Event {
    return event.type === 'erc721transfer' || event.type === 'erc721approval'
}

function isApprovalAllEvent(event: Event): event is ApprovalForAllEvent {
    return event.type === 'erc721approvalForAll'
}

const AssetPrice = ({ event }: EventProps) => {
    console.log("ASSET PRICE", event.token)
    return event.token.avgPrice?.price ?
        <div className="event_sub_col">
            <span>avg. price:</span>
            <span className="event_middle_assetPrice">
                {
                    `${event.token.avgPrice.price}`
                }
            </span>
        </div>
        : undefined

}

export const EventMiddleSection = ({ event }: EventProps) => {
    const arrow = <i className="event_middle_arrow fa fa-arrow-right header_arrow" />
    const tokenLink = <LinkFromAddress address={event.token} />

    return <div className="event_col event_middle">
        <div className="event_row">
            {
                isApprovalAllEvent(event) ?
                    undefined :
                    <img className="event_picture" src={event.token.pictureUrl} />
            }
            {
                isErc20Event(event) ?
                    <div className="event_sub_col">
                        <span className="event_middle_amount">
                            {event.amount === '-1' ? 'UNLIMITED' : `${event.amount}`}
                        </span>
                        {tokenLink}
                        {arrow}
                    </div> :
                    isErc721Event(event) ?
                        <div className="event_sub_col">
                            <span className="event_middle_amount">
                                {`#${event.tokenId}`}
                            </span>
                            {tokenLink}
                            {arrow}
                        </div> :
                        isApprovalAllEvent(event) ?
                            <div className="event_sub_col">
                                <span className="event_middle_amount">
                                    {`ALL`}
                                </span>
                                {tokenLink}
                                {arrow}
                            </div> :
                            undefined
            }
            {/* <AssetPrice event={event} /> */}
        </div>
    </div>

}

export const EventComponent = ({ event }: EventProps) => {
    return <div className="event_row">
        <div className='event_col event_addressDisplay'>
            <SimpleAddressDisplay address={event.from} size={20} />
        </div>
        <EventMiddleSection event={event} />
        <div className='event_col event_addressDisplay'>
            <SimpleAddressDisplay address={event.to} size={20} />
        </div>
    </div>
}

export const Pill = ({ event }: EventProps) => {
    let text = undefined;
    if (event.from.label === 'me' &&
        (event.type === 'erc20approval'
            || event.type === 'erc721approval'
            || event.type === 'erc721approvalForAll')
    ) {
        text = 'APPROVE'
    } else if (event.from.label === 'me') {
        text = 'OUT'
    } else if (event.to.label === 'me') {
        text = 'IN'
    } else {
        text = 'INFO'
    }
    return <span className="event_pill">
        {text}
    </span>
}

export interface EventProps {
    key?: string
    event: Event
}

export const EventRow = ({ event }: EventProps) => {
    const isIn = event.to.label === 'me'
    const isOut = event.from.label === 'me'
    const className = `event ${isIn ? 'inbound' : ''} ${isOut ? 'outbound' : ''}`
    return <div className={className}>
        <Pill event={event} />
        <EventComponent event={event} />
    </div>
}