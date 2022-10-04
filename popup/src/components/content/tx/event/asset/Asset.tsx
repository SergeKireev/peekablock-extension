import React from "react";
import { Address, ConsolidatedErc20Event, ConsolidatedErc721ApprovalForAllEvent, ConsolidatedErc721Event, ConsolidatedEvent, Token } from "../../../../../lib/domain/event";
import { USER_LABEL } from "../../../../../lib/domain/user";
import { displayAmount, displayUsdAmount, isMaxNumish } from "../../../../../lib/utils/amount";
import { WithTooltip } from "../../../common/TooltipWrapper";
import { AssetTooltip } from "./Tooltip";

export interface AssetProps {
    event: ConsolidatedEvent,
    withTooltip?: boolean
    withBorder?: boolean
    chainId: number
    actor: Address
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
    let textClass = (event.direction === 'OUT' && props.actor.label === USER_LABEL) ? 'out_text' :
        (event.direction === 'IN' && props.actor.label === USER_LABEL) ? 'in_text' :
            undefined


    if (isApprovalEvent(event) && props.actor.label === USER_LABEL) {
        textClass = 'approval_text'
    }

    let component;
    if (isApprovalAllEvent(event)) {
        component = <div className={`new_asset_component ${textClass}`}>
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
        component = <div className={`new_asset_component ${textClass}`}>
            <span>{label}</span>
            {
                event.token.pictureUrl ?
                    <div className='new_asset_logo_frame'>
                        <img className='new_asset_logo' src={event.token.pictureUrl} />
                    </div> : undefined
            }
        </div>
    } else if (isConsolidatedErc20Event(event)) {
        const usdPriceLabel = isMaxNumish(event.amount.mantissa) ? undefined :
            <span className="erc20_usd_price_label">{`$${displayUsdAmount(event.amount, event.token.usdPrice)}`}</span>

        component = <div className={`new_asset_component ${textClass}`}>
            <div className='erc20_label'>
                <span>{`${displayAmount(event.amount)} ${event.token.label}`}</span>
                {usdPriceLabel}
            </div>
            {
                event.token.pictureUrl ?
                    <div className='new_asset_logo_frame'>
                        <img className='new_asset_logo' src={event.token.pictureUrl} />
                    </div> : undefined
            }
        </div>
    }

    if (props.withTooltip) {
        const tooltipComponent = <AssetTooltip
            chainId={props.chainId}
            token={event.token}
            contractMetadata={{
                name: event.token.label,
                imageUrl: event.token.pictureUrl
            }}
        />
        return <WithTooltip
            placement="bottom-end"
            tooltip={tooltipComponent}>
            {component}
        </WithTooltip>
    } else {
        const className = props.withBorder ? "asset_border" : undefined
        return <div className={className}>
            {
                component
            }
        </div>
    }
}