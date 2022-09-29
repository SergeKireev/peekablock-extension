import { CircularProgress } from '@mui/material'
import React from 'react'
import { ActionType } from '../../../lib/domain/actions'
import { Address, ConsolidatedApprovalEvent, ConsolidatedEvent } from '../../../lib/domain/event'
import { SimulationResult } from "../../../lib/domain/simulation"
import { messages } from '../../../lib/messages/messages'
import { ConsolidatedApprovalEventRow, ConsolidatedTransferEventRow } from './event/EventRow'
import { GasRow } from './event/GasRow'

interface TransactionProps {
    action: ActionType,
    chainId: number,
    simulationResult: SimulationResult,
    me: Address,
    target: Address
}

const createPill = (category: ActionType) => {
    const className = `new_transaction_action_pill ${category.toString().toLowerCase()}`
    return <div className={className}>
        <div className='new_transaction_action_pill_col'>
            {messages[category.toUpperCase()]}
        </div>
    </div>
}

function isTransferEvent(event: ConsolidatedEvent): boolean {
    return event.type === 'erc20transfer' || event.type === 'erc721transfer'
}

function isApprovalEvent(event: ConsolidatedEvent): event is ConsolidatedApprovalEvent {
    return event.type === 'erc20approval' || event.type === 'erc721approval' || event.type === 'erc721approvalForAll'
}

export const TransactionComponent = (props: TransactionProps) => {
    const loading = !props.simulationResult
    const actionLoading = !props.action
    return <div className='new_content_box'>
        <div className='new_transaction_header_container'>
            {messages.YOU_ARE_ABOUT}: &nbsp;
            {
                actionLoading ?
                    <CircularProgress size={20} color="secondary" /> :
                    createPill(props.action)
            }
        </div>
        <div className='new_event_container'>
            {
                loading ?
                    <CircularProgress color="secondary" /> :
                    props.simulationResult.consolidated.map((event, i) => {
                        if (isTransferEvent(event))
                            return <ConsolidatedTransferEventRow chainId={props.chainId} me={props.me} target={props.target} event={event} key={i} />;
                        if (isApprovalEvent(event))
                            return <ConsolidatedApprovalEventRow chainId={props.chainId} me={props.me} target={props.target} event={event} key={i} />;
                    })}
        </div>
        {
            loading ? undefined :
                <GasRow
                    gasSpent={props.simulationResult.gasSpent}
                    ethereumPrice={props.simulationResult.ethereumPrice}
                />
        }
    </div>
}