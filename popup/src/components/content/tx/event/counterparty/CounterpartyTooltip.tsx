import React from 'react'

import { CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { fetchContractAbstract } from "../../../../../lib/service/contract_abstract_service";
import { Address } from '../../../../../lib/domain/event';
import { ManagedAssetTooltip } from '../asset/Tooltip';

interface CounterpartyTooltipProps {
    counterpartyAddress: Address,
    chainId: number
}

export const CounterpartyTooltip = (props: CounterpartyTooltipProps) => {
    const [contractAbstract, setContractAbstract] = useState(undefined);

    useEffect(() => {
        if (!contractAbstract) {
            fetchContractAbstract(
                props.counterpartyAddress.address,
                props.chainId,
                setContractAbstract
            )
        }
    })

    if (!contractAbstract) {
        return <CircularProgress size={20} color="secondary" />
    } else if (contractAbstract.isEOA) {
        return <div>
            Careful, it seems this an EOA Address
        </div>
    } else {
        const contractMetadata = {
            name: props.counterpartyAddress.address
        }
        return <ManagedAssetTooltip
            contractMetadata={contractMetadata}
            contractAbstract={contractAbstract} />
    }
}