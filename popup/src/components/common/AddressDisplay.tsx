import { JazzIcon } from "../common/JazzIcon"
import * as React from 'react';
import { LinkFromAddress } from "../common/LinkFromAddress";
import { Address } from "../../lib/domain/event";
import { USER_LABEL } from "../../lib/domain/user";
import { WithTooltip } from "../content/common/TooltipWrapper";
import { CounterpartyTooltip } from "../content/tx/event/counterparty/CounterpartyTooltip";
import { TooltipType } from "../../lib/domain/tooltip";
import { SCALING_FACTOR } from "./body/global";

export function shortenAddress(addressStr: string) {
    if (addressStr.substring(0, 2) != '0x')
        addressStr = `0x${addressStr}`
    return `${addressStr.substring(0, 4)}...${addressStr.substring(addressStr.length - 4)}`
}

export interface AddressDisplayProps {
    address: Address
    message?: string
    withTooltip?: TooltipType
    chainId?: number
}

export type Props = React.PropsWithChildren<AddressDisplayProps & React.HTMLProps<void>>

export const AddressDisplay = (props: Props) => {
    if (props.withTooltip === 'inward') {
        const tooltip = <CounterpartyTooltip
            chainId={props.chainId}
            counterpartyAddress={props.address}
        />
        const addressLabel = <WithTooltip
            placement="bottom-start"
            tooltip={tooltip}
        >
            <div className='tooltipped_address_label'>
                <div>
                    {props.address.label}
                </div>
                {
                    props.address.validated ?
                        <img className="verified_badge" src={'https://upload.wikimedia.org/wikipedia/commons/e/e4/Twitter_Verified_Badge.svg'} /> :
                        undefined
                }
            </div>
        </WithTooltip>
        return <div className={props.className}>
            <JazzIcon address={props.address} size={32} />
            {
                addressLabel
            }
        </div>
    } else if (props.withTooltip === 'outward') {
        const tooltip = <CounterpartyTooltip
            chainId={props.chainId}
            counterpartyAddress={props.address}
        />
        return <WithTooltip
            placement="bottom-start"
            tooltip={tooltip}
            className={props.className}
        >
            <JazzIcon address={props.address} size={32} />
            <div className='tooltipped_address_label'>
                <div>
                    {props.address.label}
                </div>
                {
                    props.address.validated ?
                        <img className="verified_badge" src={'https://upload.wikimedia.org/wikipedia/commons/e/e4/Twitter_Verified_Badge.svg'} /> :
                        undefined
                }
            </div>
        </WithTooltip>
    }
    else {
        const addressLabel = <div className='standard_address_label'>
            <LinkFromAddress address={props.address} />
            <div>{props.message}</div>
        </div>
        return <div className={props.className}>
            <JazzIcon address={props.address} size={32} />
            {
                addressLabel
            }
        </div>
    }
}