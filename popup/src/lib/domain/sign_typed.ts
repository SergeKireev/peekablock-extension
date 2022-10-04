interface SignTypedDomain {
    name: string
    version: string
    chainId: string
    verifyingContract: string
}

export interface SignTypedData {
    message?: any,
    domain: SignTypedDomain
}
