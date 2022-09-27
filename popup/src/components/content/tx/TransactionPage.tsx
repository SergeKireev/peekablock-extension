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

interface TransactionContainerProps {
    referrer: string
    transaction: Transaction
    reportScam: () => void
    reportBug: () => void
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
        console.error("Received error", error);
    }));
    return response;
}

async function classifyAction(transactionData: string) {
    const response = await _browser.runtime.sendMessage({
        classifyAction: {
            methodSig: transactionData
        }
    }).catch((error => {
        console.error("Received error", error);
    }));
    return response;
}

export const TransactionPage = (props: TransactionContainerProps) => {
    const chainId: number = decodeParam('chain_id', false)

    //TODO: verify target
    const transaction = props.transaction
    const me = {
        label: 'me',
        address: transaction?.from
    }
    const target: Address = {
        label: 'target',
        address: transaction?.to
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
                const validateTargetPromise = validateTarget(targetHydrated.address).catch(e => {
                    console.error(`Error when validating contract ${targetHydrated.address}`, e);
                    return undefined;
                })

                const classifyActionPromise = classifyAction(transaction.data).catch(e => {
                    if (transaction.data)
                        console.error(`Error when classifying action ${transaction.data.substring(0, 10)}`, e);
                    else {
                        console.error(`Error when classifying action ${transaction.data}`, e);
                    }
                    return undefined;
                })

                const simulationPromise = simulateTransaction(transaction).catch(e => {
                    console.error('Error when simulating transaction');
                    setSimulationFailed(e.message);
                    return undefined;
                });

                Promise.all([
                    validateTargetPromise,
                    classifyActionPromise,
                    simulationPromise
                ]).then(([
                    targetMetadata,
                    action,
                    result
                ]) => {
                    if (targetMetadata) {
                        const newTarget = {
                            ...targetHydrated,
                            label: targetMetadata.name,
                            validated: true
                        }
                        console.log("Setting new target", newTarget);
                        setTargetHydrated(newTarget);
                    }

                    if (action) {
                        setAction(action);
                    }

                    if (result) {
                        setSimulationResult(result)
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
                                />
                            </div>
                    }
                </div>
            </NewContent>
        </div>
    )
}