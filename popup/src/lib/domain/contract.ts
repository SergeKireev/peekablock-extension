export interface ContractAbstract {
    nbOfTransactions: number
    creationDate: number
    address: string
    isEOA: boolean
}

export interface ContractMetadata {
    name: string
    imageUrl?: string
}