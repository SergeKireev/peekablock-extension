import React, { useState } from 'react'
import { Address, ConsolidatedApprovalEvent, ConsolidatedEvent } from "../../../../lib/domain/event"
import { TooltipType } from '../../../../lib/domain/tooltip'
import { messages } from '../../../../lib/messages/messages'
import { fetchContractAbstract } from '../../../../lib/service/contract_abstract_service'
import { AddressDisplay } from '../../../common/AddressDisplay'
import { AssetComponent } from './asset/Asset'

interface ConsolidatedEventRowProps {
    me: Address,
    target: Address,
    event: ConsolidatedEvent,
    key: number,
    chainId: number
}

interface ConsolidatedEventProps {
    key: number
    actorAddress: Address
    pillLabel: string
    pillClassName: string
    middleIcon: string
    event: ConsolidatedEvent
    chainId: number
    withCounterpartyTooltip?: TooltipType
}


function isApprovalEvent(event: ConsolidatedEvent): event is ConsolidatedApprovalEvent {
    return event.type === 'erc20approval' || event.type === 'erc721approval' || event.type === 'erc721approvalForAll'
}

const ConsolidatedEventRowHelper = (props: ConsolidatedEventProps) => {
    const withTooltip = props.event.token.address !== '0x0'
    return <div key={props.key} className='new_transaction_event_row'>
        <div className={`new_transaction_event_pill ${props.pillClassName}`}>
            {props.pillLabel}
        </div>
        <AddressDisplay
            className='new_transaction_event_address_display'
            address={props.actorAddress}
            withTooltip={props.withCounterpartyTooltip}
            chainId={props.chainId}
        />
        <div className="new_transaction_event_middle_section">
            <img src={props.middleIcon} />
        </div>
        {
            <AssetComponent
                event={props.event}
                withTooltip={withTooltip}
                chainId={props.chainId}
                actor={props.actorAddress}
                withBorder
            />
        }
    </div >
}

export const ConsolidatedEventRow = (props: ConsolidatedEventRowProps) => {
    let pillLabel = props.event.direction === 'OUT' ? messages.SEND : messages.RECEIVE;
    let pillClassName = props.event.direction === 'OUT' ? 'new_transaction_event_pill_out out_text' : 'new_transaction_event_pill_in in_text'
    let middleIcon = props.event.direction === 'OUT' ? './assets/sending_icon.svg' : './assets/receiving_icon.svg'
    let actorAddress = props.me;

    const withCounterpartyTooltip = isApprovalEvent(props.event) ? 'inward' : undefined

    if (isApprovalEvent(props.event)) {
        pillLabel = messages.APPROVE;
        pillClassName = 'new_transaction_event_pill_approve approval_text'
        middleIcon = './assets/approval_icon.svg'
        actorAddress = props.event.to
        const [counterpartyAbstract, setCounterpartyAbstract] = useState(undefined);

        if (!counterpartyAbstract) {
            fetchContractAbstract(props.event.to.address, props.chainId, setCounterpartyAbstract)
        }
    }

    return <ConsolidatedEventRowHelper
        key={props.key}
        actorAddress={actorAddress}
        pillLabel={pillLabel}
        pillClassName={pillClassName}
        middleIcon={middleIcon}
        event={props.event}
        chainId={props.chainId}
        withCounterpartyTooltip={withCounterpartyTooltip}
    />
}















