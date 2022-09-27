import { ethers } from 'ethers'

const provider = ethers.getDefaultProvider('https://eth-mainnet.g.alchemy.com/v2/NMzqHkMm64GmdHuzjqiKaffvvqK4Sua4');

let abi = [
    "function verify(uint256 rootIndex, bytes32[] calldata proof, address contractAddress, string calldata name, string calldata organisation, bytes calldata data) public view returns (bool)",
];

//The address for the deployed contract registry
let contractAddress = '0x9B3e652901425C89935ec63F45C303796e0a9D2b';

// We connect to the Contract using a Provider, so we will only
// have read-only access to the Contract
let contract = new ethers.Contract(contractAddress, abi, provider);

export async function verifyWithContract(
    address: string,
    org: string,
    name: string,
    proof: string[]) {
    const adaptedHexProof = proof.map(x => {
        return `0x${x}`;
    })
    console.log("Verifying contact", address, org, name, proof)
    const verified = await contract.verify(0, adaptedHexProof, address, org, name, []);
    return verified;
}