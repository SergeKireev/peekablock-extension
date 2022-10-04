import { ContractAbstract } from "../domain/contract";

export function fetchContractAbstract(contractAddress: string,
    chainId: number,
    cb: (abs: ContractAbstract) => void) {
    if (contractAddress != '0x0') {
        fetch(`https://peekablock.com/abstract/contract?address=${contractAddress}&chain_id=${chainId}`)
            .then((response) => {
                response.json().then(responseObj => {
                    if (responseObj.status === 'ok') {
                        const _contractAbstract = {
                            ...(responseObj.data),
                            isEOA: !(responseObj.data.creationDate),
                            address: contractAddress
                        }
                        cb(_contractAbstract);
                    } else {
                        console.error(responseObj.msg);
                    }
                })
            })
    }
}
