import { CircularProgress } from '@mui/material'
import React from 'react'
import { ActionType } from '../../../lib/domain/actions'
import { Address } from '../../../lib/domain/event'
import { SimulationResult } from "../../../lib/domain/simulation"
import { messages } from '../../../lib/messages/messages'
import { ConsolidatedEventRow } from './event/EventRow'
import { GasRow } from './event/GasRow'
import { EmptyEventsPlaceholder } from './placeholder/EmptyEventsPlaceholder'
import { TransactionRevertedPlaceholder } from './placeholder/TransactionRevertedPlaceholder'

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

export const TransactionComponent = (props: TransactionProps) => {
    const loading = !props.simulationResult
    const actionLoading = !props.action
    const transactionReverted = props.simulationResult?.reverted
    const emptyEvents = (props.simulationResult?.allEvents || []).length === 0

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
                    transactionReverted ? <TransactionRevertedPlaceholder /> :
                        emptyEvents ? <EmptyEventsPlaceholder /> :
                        props.simulationResult.consolidated.map((event, i) => {
                            return <ConsolidatedEventRow chainId={props.chainId} me={props.me} target={props.target} event={event} key={i} />;
                        })}
        </div>
        {
            loading ? undefined :
                <GasRow
                    gasSpent={props.simulationResult.gasSpent}
                    ethereumPrice={props.simulationResult.ethereumPrice}
                    chainId={props.chainId}
                />
        }
    </div>
}