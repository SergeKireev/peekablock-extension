import { CircularProgress, ClickAwayListener, Tooltip, tooltipClasses, TooltipProps } from '@mui/material'
import { styled } from '@mui/system'
import { BigNumber } from 'ethers'
import React, { ReactElement, ReactNode, useEffect, useState } from 'react'
import { Address, ConsolidatedApprovalEvent, ConsolidatedErc20Event, ConsolidatedErc721ApprovalEvent, ConsolidatedErc721ApprovalForAllEvent, ConsolidatedErc721Event, ConsolidatedEvent } from "../../../lib/domain/event"
import { messages } from '../../../lib/messages/messages'
import { displayAmount } from '../../../lib/utils/amount'
import { AddressDisplay } from '../../common/AddressDisplay'

interface ConsolidatedEventRowProps<Ev extends ConsolidatedEvent> {
    me: Address,
    target: Address,
    event: Ev,
    key: number,
    chainId: number
}

interface ContractAbstract {
    nbOfTransactions: number
    creationDate: number
    address: string
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

const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: '#9460C8',
    },
}));

function displayRelativeDate(timestamp: number): string {
    //Not handling timezones correctly
    const now = Date.now() / 1000
    const SECONDS_IN_DAY = 3600 * 24

    if (now - timestamp < SECONDS_IN_DAY) {
        return 'today'
    } else {
        const daysAgo = Math.round((now - timestamp) / SECONDS_IN_DAY)
        return `${daysAgo} days ago`
    }
}

function wrapWithTooltip(el: ReactElement, contractAbstract: ContractAbstract) {
    const [open, setOpen] = React.useState(false);

    const handleTooltipClose = () => {
        setOpen(false);
    };

    const handleTooltipOpen = () => {
        setOpen(true);
    };

    return <ClickAwayListener onClickAway={handleTooltipClose}>
        <div>
            <HtmlTooltip
                disableHoverListener
                disableFocusListener
                disableTouchListener
                open={open}
                onClose={handleTooltipClose}
                title={
                    <React.Fragment>
                        {contractAbstract ?
                            <div className='asset_tooltip'>
                                Contract created <b>{displayRelativeDate(contractAbstract.creationDate)}</b><br />
                                Average number of transactions per day: <b>{contractAbstract.nbOfTransactions}</b><br />
                                <a href={`https://etherscan.io/address/${contractAbstract.address}`}>Check on etherscan</a>
                            </div> :
                            <CircularProgress size={20} color="inherit" />
                        }
                    </React.Fragment>
                }
            >
                <div onClick={handleTooltipOpen}>
                    {el}
                </div>
            </HtmlTooltip>
        </div>
    </ClickAwayListener>
}

function buildAssetComponent(event: ConsolidatedEvent) {
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
        return <div className={`new_asset_component ${textClass}`}>
            <span>{`${event.token.label} ${event.tokenId}`}</span>
            {
                event.token.pictureUrl ?
                    <div className='new_asset_logo_frame'>
                        <img className='new_asset_logo' src={event.token.pictureUrl} />
                    </div> : undefined
            }
        </div>
    } else if (isConsolidatedErc20Event(event)) {
        return <div className={`new_asset_component ${textClass}`}>
            <span>{`${displayAmount(BigNumber.from(event.amount.mantissa), event.amount.exponent)} ${event.token.label}`}</span>
            {
                event.token.pictureUrl ?
                    <div className='new_asset_logo_frame'>
                        <img className='new_asset_logo' src={event.token.pictureUrl} />
                    </div> : undefined
            }
        </div>
    }
}

export const ConsolidatedTransferEventRow = (props: ConsolidatedEventRowProps<ConsolidatedEvent>) => {
    const pillLabel = props.event.direction === 'OUT' ? messages.SEND : messages.RECEIVE;
    const pillClassName = props.event.direction === 'OUT' ? 'new_transaction_event_pill_out out_text' : 'new_transaction_event_pill_in in_text'
    const middleIcon = props.event.direction === 'OUT' ? './assets/sending_icon.svg' : './assets/receiving_icon.svg'

    const [contractAbstract, setContractAbstract] = useState(undefined);

    useEffect(() => {
        if (!contractAbstract) {
            fetch(`https://peekablock.com/abstract/contract?address=${props.event.token.address}&chain_id=${props.chainId}`)
                .then((response) => {
                    response.json().then(responseObj => {
                        if (responseObj.status === 'ok') {
                            const _contractAbstract = {
                                ...(responseObj.data),
                                address: props.event.token.address
                            }
                            setContractAbstract(_contractAbstract);
                        } else {
                            console.error(responseObj.msg);
                        }
                    })
                })
        }
    })

    console.log('Contract abstract for token', props.event.token.label, contractAbstract);

    return <div key={props.key} className='new_transaction_event_row'>
        <div className={`new_transaction_event_pill ${pillClassName}`}>
            {pillLabel}
        </div>
        <AddressDisplay className='new_transaction_event_address_display' address={props.me} />
        <div className="new_transaction_event_middle_section">
            <img src={middleIcon} />
        </div>
        {
            wrapWithTooltip(buildAssetComponent(props.event), contractAbstract)
        }
    </div >
}

export const ConsolidatedApprovalEventRow = (props: ConsolidatedEventRowProps<ConsolidatedApprovalEvent>) => {
    const pillLabel = messages.APPROVE;
    const pillClassName = 'new_transaction_event_pill_approve approval_text'
    const middleIcon = './assets/approval_icon.svg'

    const [contractAbstract, setContractAbstract] = useState(undefined);

    useEffect(() => {
        if (!contractAbstract) {
            fetch(`https://peekablock.com/abstract/contract?address=${props.event.token.address}&chain_id=${props.chainId}`)
                .then((response) => {
                    response.json().then(responseObj => {
                        if (responseObj.status === 'ok') {
                            const _contractAbstract = responseObj.data
                            setContractAbstract(_contractAbstract);
                        } else {
                            console.error(responseObj.msg);
                        }
                    })
                })
        }
    })

    console.log('Contract abstract for token', props.event.token.label, contractAbstract);

    return <div key={props.key} className='new_transaction_event_row'>
        <div className={`new_transaction_event_pill ${pillClassName}`}>
            {pillLabel}
        </div>
        <AddressDisplay className='new_transaction_event_address_display' address={props.event.to} />
        <div className="new_transaction_event_middle_section">
            <img src={middleIcon} />
        </div>
        {
            wrapWithTooltip(buildAssetComponent(props.event), contractAbstract)
        }
    </div >
}















