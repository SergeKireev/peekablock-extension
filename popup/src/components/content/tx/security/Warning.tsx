import { ConsolidatedEvent } from "../../../../lib/domain/event"
import React from "react"
import { messages } from "../../../../lib/messages/messages"
import { isApprove, isOnlyOut } from "../../../../lib/security/assessment"

interface WarningContainerProps {
    events: ConsolidatedEvent[]
}

interface WarningProps {
    message: string
}


export const Warning = (props: WarningProps) => {
    return <div className='events_warning'>
        <img src='./assets/warning_triangle_white.svg' />
        {props.message}
    </div>
}

export const WarningContainer = (props: WarningContainerProps) => {
    const _isApprove = isApprove(props.events);
    const _isOnlyOut = isOnlyOut(props.events);

    return _isApprove ?
        <Warning message={messages.WARNING_APPROVAL} /> :
        (_isOnlyOut ?
            <Warning message={messages.WARNING_ONLY_OUT} /> :
            undefined)
}