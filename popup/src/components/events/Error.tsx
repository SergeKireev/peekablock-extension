import * as React from 'react'
import { ErrorResult } from "../../domain/simulation"

interface ErrorProps {
    metadata: ErrorResult
}

export const Error = ({ metadata }: ErrorProps) => {
    return <div className="error_container">
        <i className="fa fa-times error_icon" />
        <span>
            {metadata.msg}
        </span>
    </div>
}