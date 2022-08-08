import { Transaction } from "../domain/transaction";

export async function simulateTransaction(transaction: Transaction) {
    const response = await fetch(`https://peekablock.com/`, {
        method: 'POST',
        body: JSON.stringify(transaction),
        headers: {
          'content-type': 'application/json'
        }
      }).catch(e => {
        console.error(e)
        return undefined
      });
      return await response.json().catch(console.error);
}