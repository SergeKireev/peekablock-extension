import React, { useEffect, useState } from 'react'
import { Transaction } from '../../../lib/domain/transaction';
import { simulateTransaction } from '../../../lib/service/simulation_service';
import { Address } from '../../../lib/domain/event';
import { TransactionComponent } from './Transaction';
import { TransactionDetails } from './details/TransactionDetails';
import { decodeParam } from '../../../lib/utils/uri';
import { NewContent } from '../NewContent';
import { messages } from '../../../lib/messages/messages';
import { NewHeader } from '../../header/NewHeader';
import { ErrorContent } from '../common/ErrorContent';
import { SecurityAssessment } from './security/SecurityAssessment';
import { USER_LABEL } from '../../../lib/domain/user';
import { shortenAddress } from '../../common/AddressDisplay';

interface TransactionContainerProps {
    referrer: string
    transaction: Transaction
    reportScam: () => void
    reportBug: (message: string) => void
}

let _browser = undefined
let isChrome = undefined
try {
    //@ts-ignore
    _browser = browser ? browser : chrome
    isChrome = false
} catch {
    //@ts-ignore
    _browser = chrome
    isChrome = true
}

async function validateTarget(address) {
    const response = await _browser.runtime.sendMessage({
        validateContract: {
            address: address
        }
    }).catch((error => {
        return {
            status: 'nok',
            message: error.message
        }
    }));
    return response;
}

async function classifyAction(transactionData: string) {
    const response = await _browser.runtime.sendMessage({
        classifyAction: {
            methodSig: transactionData
        }
    }).catch((error => {
        return {
            status: 'nok',
            message: error.message
        }
    }));
    return response;
}

export const TransactionPage = (props: TransactionContainerProps) => {
    const chainId: number = decodeParam('chain_id', false)

    //TODO: verify target
    const transaction = props.transaction
    const me = {
        label: USER_LABEL,
        address: transaction?.from
    }
    const target: Address = {
        label: shortenAddress(transaction?.to),
        address: transaction.to
    }

    const [targetHydrated, setTargetHydrated] = useState(target);
    const [simulationResult, setSimulationResult] = useState(undefined);
    const [simulationFailed, setSimulationFailed] = useState(undefined)
    const [action, setAction] = useState(undefined)

    function _simulateTransaction(
        transaction: any,
        targetHydrated: any,
    ) {
        useEffect(() => {
            (async () => {
                const validateTargetPromise = validateTarget(targetHydrated.address)
                const classifyActionPromise = classifyAction(transaction.data)
                const simulationPromise = simulateTransaction(transaction, chainId)

                Promise.all([
                    validateTargetPromise,
                    classifyActionPromise,
                    simulationPromise
                ]).then(([
                    targetMetadata,
                    action,
                    result
                ]) => {
                    if ((targetMetadata && targetMetadata.status === 'nok') ||
                        (action && action.status === 'nok') ||
                        (result && result.status === 'nok')
                    ) {
                        const targetMetadataMessage = targetMetadata?.message
                        const actionMessage = action?.message
                        const resultMessage = result?.message
                        const fullMessage = {
                            targetMetadataMessage: targetMetadataMessage,
                            actionMessage: actionMessage,
                            resultMessage: resultMessage
                        }
                        setSimulationFailed(JSON.stringify(fullMessage))
                    }

                    if (targetMetadata) {
                        const newTarget = {
                            ...targetHydrated,
                            label: targetMetadata.name,
                            validated: true
                        }
                        setTargetHydrated(newTarget);
                    }

                    if (action) {
                        setAction(action);
                    }

                    if (result) {
                        setSimulationResult(result)
                    } else {
                        setSimulationFailed('Simulation result is undefined')
                    }
                })
            })();
        }, [])
    }

    if (props.transaction)
        _simulateTransaction(transaction, targetHydrated)

    return (
        <div className='new_container'>
            <NewHeader />
            <NewContent
                titleIcon={
                    './assets/link.svg'
                }
                title={
                    props.referrer ?
                        props.referrer :
                        messages.TRANSACTION_TITLE
                }
                reportScam={props.reportScam}
                hideTitle={simulationFailed !== undefined}>
                <div className="new_content_body">
                    {
                        simulationFailed ?
                            < ErrorContent
                                message={simulationFailed}
                                reportBug={props.reportBug} /> :
                            <div>
                                <TransactionComponent
                                    chainId={chainId}
                                    action={action}
                                    me={me}
                                    target={target}
                                    simulationResult={simulationResult} />
                                <SecurityAssessment simulationResult={simulationResult} />
                                <TransactionDetails me={me}
                                    target={target}
                                    simulationResult={simulationResult}
                                    chainId={chainId}
                                />
                            </div>
                    }
                </div>
            </NewContent>
        </div>
    )
}