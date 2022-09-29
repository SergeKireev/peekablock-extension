import { ClickAwayListener, Tooltip, tooltipClasses, TooltipProps } from '@mui/material'
import { styled } from '@mui/system'
import React, { ReactElement, useEffect, useState } from 'react'
import { ContractAbstract } from '../../../../lib/domain/contract'
import { Address, ConsolidatedApprovalEvent, ConsolidatedErc20Event, ConsolidatedErc721ApprovalForAllEvent, ConsolidatedErc721Event, ConsolidatedEvent, Token } from "../../../../lib/domain/event"
import { messages } from '../../../../lib/messages/messages'
import { AddressDisplay } from '../../../common/AddressDisplay'
import { AssetComponent } from './asset/Asset'
import { AssetTooltip } from './asset/Tooltip'

interface ConsolidatedEventRowProps<Ev extends ConsolidatedEvent> {
    me: Address,
    target: Address,
    event: Ev,
    key: number,
    chainId: number
}


const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: '#00000000',
    },
}));

function wrapWithTooltip(el: ReactElement, contractAbstract: ContractAbstract, token: Token) {
    const [open, setOpen] = React.useState(false);

    const handleTooltipClose = () => {
        setOpen(false);
    };

    const handleTooltipToggle = () => {
        setOpen(!open);
    };

    const className = !open ? 'tooltippable' : 'tooltippable-selected'

    return <ClickAwayListener onClickAway={handleTooltipClose}>
        <div className={className}>
            <HtmlTooltip
                disableHoverListener
                disableFocusListener
                disableTouchListener
                open={open}
                onClose={handleTooltipClose}
                title={
                    <AssetTooltip
                        contractAbstract={contractAbstract}
                        contractMetadata={{
                            name: token.label,
                            imageUrl: token.pictureUrl
                        }}
                    />
                }
            >
                <div onClick={handleTooltipToggle}>
                    {el}
                </div>
            </HtmlTooltip>
        </div>
    </ClickAwayListener>
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

    return <div key={props.key} className='new_transaction_event_row'>
        <div className={`new_transaction_event_pill ${pillClassName}`}>
            {pillLabel}
        </div>
        <AddressDisplay className='new_transaction_event_address_display' address={props.me} />
        <div className="new_transaction_event_middle_section">
            <img src={middleIcon} />
        </div>
        {
            wrapWithTooltip(<AssetComponent event={props.event}/>, contractAbstract, props.event.token)
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
            wrapWithTooltip(<AssetComponent event={props.event}/>, contractAbstract, props.event.token)
        }
    </div >
}















