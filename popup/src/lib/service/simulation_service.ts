import { Transaction } from "../domain/transaction";

export async function simulateTransaction(transaction: Transaction, chainId: number) {
  transaction = {
    ...transaction,
    chainId: chainId
  }
  const response = await (fetch(`https://peekablock.com/`, {
    method: 'POST',
    body: JSON.stringify(transaction),
    headers: {
      'content-type': 'application/json'
    }
  }).catch(e => {
    console.error('Error during simulation call', e)
    return e.message
  }));

  if (typeof (response) === 'string') {
    return {
      status: 'nok',
      message: response
    }
  }
  if (response.status != 200) {
    const message = await (response.text().catch(e => response.statusText))
    return {
      status: 'nok',
      message: message
    }
  }
  const json = await response.json().catch(e => {
    return {
      status: 'nok',
      message: e.message
    }
  });

  if (json.type === 'nok') {
    return {
      status: 'nok',
      message: json.msg
    }
  }

  return json
}