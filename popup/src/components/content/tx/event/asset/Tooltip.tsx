import { CircularProgress } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { ContractAbstract, ContractMetadata } from '../../../../../lib/domain/contract'
import { Token } from '../../../../../lib/domain/event'
import { fetchContractAbstract } from '../../../../../lib/service/contract_abstract_service'
import { displayRelativeDate } from '../../../../../lib/utils/date'

interface AssetTooltipProps {
    token: Token
    chainId: number
    contractMetadata: ContractMetadata
}

interface ManagedAssetTooltipProps {
    contractAbstract: ContractAbstract
    contractMetadata: ContractMetadata
}

export const ManagedAssetTooltip = (props: ManagedAssetTooltipProps) => {
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
                    <div className='asset_tooltip_key'>Avg number of txs per day:</div>
                    <div className='asset_tooltip_value'>{props.contractAbstract.nbOfTransactions}</div>
                </div>
                <div className='asset_tooltip_row'>
                    <div className='asset_tooltip_key'>View block explorer:</div>
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

/**
 * TODO: Replace texts with message
 */
export const AssetTooltip = (props: AssetTooltipProps) => {

    const [contractAbstract, setContractAbstract] = useState(undefined);

    useEffect(() => {
        if (!contractAbstract) {
            fetchContractAbstract(props.token.address, props.chainId, setContractAbstract)
        }
    })

    return <ManagedAssetTooltip
        contractAbstract={contractAbstract}
        contractMetadata={props.contractMetadata}
    />
}