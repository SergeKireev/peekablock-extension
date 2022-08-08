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

    const transaction = {
        "from": "0xca56c263fd892f76679661dbc2a1aa93bffb4028",
        "to": "0x00000000006c3852cbef3e08e8df289169ede581",
        "value": "0x9536c708910000",
        "data": "0xfb0f3ee100000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000828fee277ee000000000000000000000000000beda3e276368dc2d2b01684ee6c4b879af54200c000000000000000000000000004c00500000ad104d7dbd00e3ae0a5c00560c000000000000000000000000007c3e8096b70a4ddc04c4344b8f33b97c9d12bc4e000000000000000000000000000000000000000000000000000000000000010f000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000062f0edfd000000000000000000000000000000000000000000000000000000006319cc7d0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004aa8855e07e14a0000007b02230091a7ed01230072f7006a004d60a8d4e71d599b8104250f00000000007b02230091a7ed01230072f7006a004d60a8d4e71d599b8104250f00000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000024000000000000000000000000000000000000000000000000000000000000002e000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000003baf82d03a0000000000000000000000000008de9c5a032463c561423387a9648c5c7bcc5bc90000000000000000000000000000000000000000000000000000eebe0b40e8000000000000000000000000000a9a2590f92d456f9915df0eca3ac65438d41a7f60000000000000000000000000000000000000000000000000000000000000041f0a892142e0a1f779d52827f9467e657984ab78e90eec0d2c11dc344b824780f5e24816324d4bacf374f43f6741ebc74fce54735e26a5189b9c3ef168d3b07981c00000000000000000000000000000000000000000000000000000000000000",
        "gas": "0x3a7e8",
        "maxPriorityFeePerGas": "0x9502F900",
        "maxFeePerGas": "0xadf5b0bc4"
    } 
    // decodeParam('transaction', true)
    const hostname = decodeParam('referrer', false)

    console.log("transaction", transaction)

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