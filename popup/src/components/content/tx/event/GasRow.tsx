import React from 'react'
import { EthereumInfo } from '../../../../lib/domain/ethereum'
import { Amount, ConsolidatedErc20Event } from '../../../../lib/domain/event'
import { USER_LABEL } from '../../../../lib/domain/user'
import { AssetComponent } from './asset/Asset'

export interface GasRowProps {
    gasSpent: Amount,
    ethereumPrice: number
    chainId: number
}

function buildEvent(gasSpent: Amount, ethereumPrice: number): ConsolidatedErc20Event {
    const infoWithPrice = {
        ...EthereumInfo,
        usdPrice: ethereumPrice
    }
    return {
        amount: gasSpent,
        direction: 'OUT',
        token: infoWithPrice,
        type: 'erc20transfer'
    }
}

export const GasRow = (props: GasRowProps) => {

    return <div className='new_gas_row_container'>
        <div className='new_gas_row_row'>
            <div className='new_gas_row_title'>
                Simulated gas fees:
            </div>
            <div>
                <AssetComponent
                    event={buildEvent(props.gasSpent, props.ethereumPrice)}
                    chainId={props.chainId}
                    actor={{
                        address: '0x0',
                        label: USER_LABEL
                    }}
                />
            </div>
        </div>
    </div>
}