import { Header } from './components/header/header';
import { displayTwitterButton } from './components/footer/twitter'
import { Transaction } from './domain/transaction';
import { simulateTransaction } from './service/simulation_service';
import * as React from 'react';
import { useEffect, useState } from "react";
import { Content } from './components/events/Content';

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
    const target = {
        label: 'target',
        address: transaction.to
    }

    const [simulationResult, setSimulationResult] = useState(null)

    console.log("Simulating transaction", transaction)

    useEffect(() => {
        (async () => {
            displayTwitterButton(target, hostname);
            const result = await simulateTransaction(transaction)
            setSimulationResult(result)
        })();
    }, [])

    return (<div className='container'>
        <div className="header_container">
            <span className="header_title">Transaction between :</span>
            <Header me={me} target={target} />
        </div>
        {simulationResult === null ?
            <div className="spinner_container">
                <div id="spinner" className="spinner"></div>
            </div> :
            <Content metadata={simulationResult} me={me} target={target}/>
        }
    </div>);
};

export default App;