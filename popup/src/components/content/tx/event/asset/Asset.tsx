import React from "react";
import { ConsolidatedErc20Event, ConsolidatedErc721ApprovalForAllEvent, ConsolidatedErc721Event, ConsolidatedEvent } from "../../../../../lib/domain/event";
import { displayAmount, displayUsdAmount } from "../../../../../lib/utils/amount";

export interface AssetProps {
    event: ConsolidatedEvent
}

function isConsolidatedErc20Event(event: ConsolidatedEvent): event is ConsolidatedErc20Event {
    return event.type === 'erc20transfer' || event.type === 'erc20approval'
}

function isConsolidatedErc721Event(event: ConsolidatedEvent): event is ConsolidatedErc721Event {
    return event.type === 'erc721transfer' || event.type === 'erc721approval' || event.type === 'erc721approvalForAll'
}

function isApprovalEvent(event: ConsolidatedEvent) {
    return event.type === 'erc20approval' || event.type === 'erc721approval' || event.type === 'erc721approvalForAll'
}

function isApprovalAllEvent(event: ConsolidatedEvent): event is ConsolidatedErc721ApprovalForAllEvent {
    return event.type === 'erc721approvalForAll'
}

export const AssetComponent = (props: AssetProps) => {
    const event = props.event;
    let textClass = event.direction === 'OUT' ? 'out_text' : 'in_text';


    if (isApprovalEvent(event)) {
        textClass = 'approval_text'
    }

    if (isApprovalAllEvent(event)) {
        return <div className={`new_asset_component ${textClass}`}>
            <span>{`ALL ${event.token.label}`}</span>
            {
                <div className='new_asset_logo_frame'>
                    <img className='new_asset_logo' src={event.token.pictureUrl} style={{ visibility: 'hidden' }} />
                </div>
            }
        </div>
    } else if (isConsolidatedErc721Event(event)) {
        const label = event.token.label.indexOf(event.tokenId) !== -1 ?
            event.token.label :
            `${event.token.label} ${event.tokenId}`
        return <div className={`new_asset_component ${textClass}`}>
            <span>{label}</span>
            {
                event.token.pictureUrl ?
                    <div className='new_asset_logo_frame'>
                        <img className='new_asset_logo' src={event.token.pictureUrl} />
                    </div> : undefined
            }
        </div>
    } else if (isConsolidatedErc20Event(event)) {
        const usdPriceLabel = displayUsdAmount(event.amount, event.token.usdPrice)
        return <div className={`new_asset_component ${textClass}`}>
            <div className='erc20_label'>
                <span>{`${displayAmount(event.amount)} ${event.token.label}`}</span>
                <span className="erc20_usd_price_label">{`$${usdPriceLabel}`}</span>
            </div>
            {
                event.token.pictureUrl ?
                    <div className='new_asset_logo_frame'>
                        <img className='new_asset_logo' src={event.token.pictureUrl} />
                    </div> : undefined
            }
        </div>
    }
}