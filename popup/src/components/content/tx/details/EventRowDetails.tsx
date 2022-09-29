import React from "react"
import { Address, Erc20Event, Erc721Event, Event, Token } from "../../../../lib/domain/event"
import { USER_LABEL } from "../../../../lib/domain/user"
import { displayAmount, displayUsdAmount } from '../../../../lib/utils/amount'
import { AddressDisplay } from "../../../common/AddressDisplay"

type Direction = 'IN' | 'OUT'

export interface EventRowDetailsProps {
    actor: Address
    direction: Direction
    event: Event
}

const isApprovalEvent = (event: Event) => {
    return event.type === 'erc20approval' || event.type === 'erc721approval' || event.type === 'erc721approvalForAll'
}

const isApprovalAllEvent = (event: Event) => {
    return event.type === 'erc721approvalForAll'
}

const isErc721 = (event: Event): event is Erc721Event => {
    return event.type === 'erc721transfer' || event.type === 'erc721approval'
}

const isErc20 = (event: Event): event is Erc20Event => {
    return event.type === 'erc20approval' || event.type === 'erc20transfer'
}

function isIn(actor: Address, direction: Direction) {
    return actor.label === USER_LABEL && direction === 'IN'
}

function isOut(actor: Address, direction: Direction) {
    return actor.label === USER_LABEL && direction === 'OUT'
}


function buildDetailsAssetComponent(event: Event, actor: Address, direction: Direction) {
    let textClass =
        isIn(actor, direction) ? 'in_text' :
            isOut(actor, direction) ? 'out_text' :
                'neutral_text'

    if (isApprovalEvent(event)) {
        textClass = 'approval_text'
    }

    if (isApprovalAllEvent(event)) {
        return <div className={`new_asset_details_component ${textClass}`}>
            <span>{`ALL ${event.token.label}`}</span>
            {
                <img className='new_asset_logo' src={event.token.pictureUrl} style={{ visibility: 'hidden' }} />
            }
        </div>
    } else if (isErc721(event)) {
        const label = event.token.label.indexOf(event.tokenId) !== -1 ?
            event.token.label :
            `${event.token.label} ${event.tokenId}`

        return <div className={`new_asset_details_component ${textClass}`}>
            <span>{label}</span>
            {
                event.token.pictureUrl ?
                    <img className='new_asset_logo' src={event.token.pictureUrl} /> : undefined
            }
        </div>
    } else if (isErc20(event)) {
        const usdPriceLabel = displayUsdAmount(event.amount, event.token.usdPrice)
        return <div className={`new_asset_details_component ${textClass}`}>
            <div className='erc20_label'>
                <span>{`${displayAmount(event.amount)} ${event.token.label}`}</span>
                <span className="erc20_usd_price_label">{`$${usdPriceLabel}`}</span>
            </div>
            {
                event.token.pictureUrl ?
                    <img className='new_asset_logo' src={event.token.pictureUrl} /> : undefined
            }
        </div>
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
                    {buildDetailsAssetComponent(
                        props.event,
                        props.actor,
                        props.direction
                    )}
                </div>
            </div>
        </div>
    </div>
}