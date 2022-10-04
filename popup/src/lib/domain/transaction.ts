export interface Transaction {
    from: string
    to: string
    data: string
    value: string
    gas: string
    maxPriorityFeePerGas: string
    maxFeePerGas: string
    chainId?: number
}