import { BigNumber } from "ethers"
import React from "react"
import { Erc20Event, Erc721Event, Event } from "../../../../lib/domain/event"
import { displayAmount } from '../../../../lib/utils/amount'
import { AddressDisplay } from "../../../common/AddressDisplay"

export interface EventRowDetailsProps {
    event: Event
}

const isIn = (event: Event) => {
    return event.to.label === 'me';
}

const isOut = (event: Event) => {
    return event.from.label === 'me';
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

function buildDetailsAssetComponent(event: Event) {
    let textClass =
        isIn(event) ? 'in_text' :
            isOut(event) ? 'out_text' :
                'neutral_text'

    if (isApprovalEvent(event)) {
        textClass = 'approval_text'
    }


    if (isApprovalAllEvent(event)) {
        return <div className={`new_asset_component ${textClass}`}>
            <span>ALL</span>
            <span>{event.token.label}</span>
            {
                <img className='new_asset_logo' src={event.token.pictureUrl} style={{ visibility: 'hidden' }} />
            }
        </div>
    } else if (isErc721(event)) {
        return <div className={`new_asset_component ${textClass}`}>
            <span>{event.token.label}</span>
            <span>{event.tokenId}</span>
            {
                event.token.pictureUrl ?
                    <img className='new_asset_logo' src={event.token.pictureUrl} /> : undefined
            }
        </div>
    } else if (isErc20(event)) {
        return <div className={`new_asset_component ${textClass}`}>
            <span>{displayAmount(BigNumber.from(event.amount.mantissa), event.amount.exponent)}</span>
            <span>{event.token.label}</span>
            {
                event.token.pictureUrl ?
                    <img className='new_asset_logo' src={event.token.pictureUrl} /> : undefined
            }
        </div>
    }
}

export const EventRowDetails = (props: EventRowDetailsProps) => {
    const event = props.event
    let middleIcon =
        isIn(props.event) ? './assets/receiving_icon_reversed.svg' :
            isOut(props.event) ? './assets/sending_icon.svg' :
                './assets/neutral_arrow_icon.svg'

    if (isApprovalEvent(props.event)) {
        middleIcon = './assets/approval_icon.svg'
    }

    return <div className='event_row_details'>
        <AddressDisplay className='new_transaction_details_event_address_display' address={event.from} />
        <div className="new_transaction_event_middle_section">
            <div className="event_row_details_middle_col">
                <div className="event_row_details_middle_row">
                    <img src={middleIcon} />
                    {buildDetailsAssetComponent(props.event)}
                </div>
            </div>
        </div>
        <AddressDisplay className='new_transaction_details_event_address_display' address={event.to} />
    </div>
}