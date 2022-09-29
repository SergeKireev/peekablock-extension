import { CircularProgress } from '@mui/material'
import React from 'react'
import { ContractAbstract, ContractMetadata } from '../../../../../lib/domain/contract'
import { displayRelativeDate } from '../../../../../lib/utils/date'

interface AssetTooltipProps {
    contractAbstract: ContractAbstract
    contractMetadata: ContractMetadata
}

/**
 * TODO: Replace texts with message
 */
export const AssetTooltip = (props: AssetTooltipProps) => {
    return <React.Fragment>
        {props.contractAbstract ?
            <div className='asset_tooltip'>
                <div className='asset_tooltip_title'>
                    {props.contractMetadata.imageUrl ?
                        <img className='asset_tooltip_title_icon' src={props.contractMetadata.imageUrl} /> : undefined}
                    <div className='asset_tooltip_title_text'>
                        {`Details for ${props.contractMetadata.name}`}
                    </div>
                </div>
                <div className='asset_tooltip_row'>
                    <div className='asset_tooltip_key'>Contract created:</div>
                    <div className='asset_tooltip_value'>{displayRelativeDate(props.contractAbstract.creationDate)}</div>
                </div>
                <div className='asset_tooltip_row'>
                    <div className='asset_tooltip_key'>Average number of transactions per day:</div>
                    <div className='asset_tooltip_value'>{props.contractAbstract.nbOfTransactions}</div>
                </div>
                <div className='asset_tooltip_row'>
                    <div className='asset_tooltip_key'>Check on etherscan:</div>
                    <div className='asset_tooltip_value'>
                        <a href={`https://etherscan.io/address/${props.contractAbstract.address}`}>
                            <div className='asset_tooltip_row'>
                                <div>etherscan.io</div>
                                <img className='asset_tooltip_link_icon' src='./assets/link.svg' />
                            </div>
                        </a>
                    </div>
                </div>
            </div> :
            <CircularProgress size={20} color="secondary" />
        }
    </React.Fragment>
}