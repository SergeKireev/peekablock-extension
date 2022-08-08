import * as React from 'react'
import { useState } from 'react'
import ReactSwitch from 'react-switch'
import { Address } from '../../domain/event'
import { isNok, isOk, SimulationResult } from '../../domain/simulation'
import { Error } from './Error'
import { EventSection } from './EventSection'

interface SectionProps {
    metadata: SimulationResult,
    me: Address,
    target: Address
}

export function adaptEthValueToTransferEvent(value: string, me: Address, target: Address) {
    const type: "erc20transfer" = "erc20transfer"
    return {
        "type": type,
        "token": {
            "label": "Ethereum",
            "address": "0x0",
            "pictureUrl": "https://ethereum.org/static/6b935ac0e6194247347855dc3d328e83/13c43/eth-diamond-black.png"
        },
        "from": me,
        "to": target,
        "amount": value
    }
}

const TransferListComponent = ({ metadata, me, target }: SectionProps) => {
    const transfers =
        metadata.erc20Transfers
            .concat(metadata.erc721Transfers)
            .filter(t => t.to.label === 'me' || t.from.label === 'me')

    if (metadata.valueDiff !== '0,00000' && metadata.valueDiff !== '0') {
        const ethTransfer = adaptEthValueToTransferEvent(metadata.valueDiff, me, target)
        transfers.push(ethTransfer)
    }
    return <EventSection title="Transfers" events={transfers} />
}

const OtherTransferListComponent = ({ metadata }: SectionProps) => {
    const otherTransfers = metadata.erc20Transfers
        .concat(metadata.erc721Transfers)
        .filter(t => t.to.label !== 'me' && t.from.label !== 'me')

    return <EventSection title="Other transfers" events={otherTransfers} />
}

const ApprovalsListComponent = ({ metadata }: SectionProps) => {
    const approvals =
        metadata.erc20Approvals
            .concat(metadata.erc721Approvals)
    return <EventSection title="Approvals" events={approvals} />
}

const AllEventsListComponent = ({ metadata, me, target }: SectionProps) => {
    const events = metadata.allEvents.slice()
    if (metadata.valueDiff !== '0,00000' && metadata.valueDiff !== '0') {
        const ethTransfer = adaptEthValueToTransferEvent(metadata.valueDiff, me, target)
        events.unshift(ethTransfer)
    }
    return <EventSection title="Events" events={events} />
}

interface WithCategorize {
    categorize: boolean
}
const EventList = ({ metadata, me, target, categorize }: SectionProps & WithCategorize) => {
    if (categorize) {
        return <div>
            <TransferListComponent metadata={metadata} me={me} target={target} />
            <OtherTransferListComponent metadata={metadata} me={me} target={target} />
            <ApprovalsListComponent metadata={metadata} me={me} target={target} />
        </div>
    } else {
        return <AllEventsListComponent metadata={metadata} me={me} target={target} />
    }
}

export const Content = ({ metadata, me, target }) => {
    const [categorize, setCategorize] = useState(false)
    const _this = this;
    if (isOk(metadata)) {
        if (metadata.allEvents.length === 0) {
            return <Error metadata={{
                type: 'nok',
                msg: `Nothing to see here. Maybe the website is trying to drain an empty wallet?`
            }} />
        } else {
            return <div>
                <div className="content_switch_container">
                    <ReactSwitch
                        className="content_switch"
                        onChange={setCategorize}
                        checked={categorize}
                        uncheckedIcon={false}
                        checkedIcon={false}
                        onColor={"#8F82C2"}
                        height={15}
                        width={30}
                    />
                    <span className="content_switch_label">
                        Categorize events
                    </span>
                </div>
                <EventList metadata={metadata} me={me} target={target} categorize={categorize} />
            </div>
        }
    } else if (isNok(metadata)) {
        return <Error metadata={metadata} />
    }
}