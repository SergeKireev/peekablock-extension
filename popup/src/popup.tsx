import { Header } from './components/header/header';
import { displayTwitterButton } from './components/footer/twitter'
import { Transaction } from './domain/transaction';
import { simulateTransaction } from './service/simulation_service';
import * as React from 'react';
import { useEffect, useState } from "react";
import { Content } from './components/events/Content';
import { Address } from './domain/event';

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


export const decodeParam = (param: any, isJson: boolean) => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const qsJson = urlParams.get(param)
    let result = decodeURI(qsJson)
    return isJson ? JSON.parse(result) : result
}

export const setupTransactionData = async (transaction: Transaction) => {
    return await simulateTransaction(transaction)
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

const App = () => {
    const action = decodeParam('action', false)
    if (action === 'close') {
        setTimeout(() => {
            window.close()
        }, 1000);
        return;
    }

    const transaction = decodeParam('transaction', true)
    const hostname = decodeParam('referrer', false)

    const me = {
        label: 'me',
        address: transaction.from
    }
    const target: Address = {
        label: 'target',
        address: transaction.to
    }

    //TODO: verify target
    const [simulationResult, setSimulationResult] = useState(null)
    const [targetHydrated, setTargetHydrated] = useState(target);

    useEffect(() => {
        (async () => {
            displayTwitterButton(targetHydrated, hostname);
            const targetMetadata = await validateTarget(targetHydrated.address);
            if (targetMetadata) {
                const newTarget = {
                    ...targetHydrated,
                    label: targetMetadata.name,
                    validated: true
                }
                console.log("Setting new target", newTarget);
                setTargetHydrated(newTarget);
            }
            const result = await simulateTransaction(transaction)
            setSimulationResult(result)
        })();
    }, [])

    return (<div className='container'>
        <div className="header_container">
            <span className="header_title">Transaction between :</span>
            <Header me={me} target={targetHydrated} />
        </div>
        {simulationResult === null ?
            <div className="spinner_container">
                <div id="spinner" className="spinner"></div>
            </div> :
            <Content metadata={simulationResult} me={me} target={targetHydrated} />
        }
    </div>);
};

export default App;