import React from 'react'

interface EmptyEventsPlaceholderProps {
    msg?: string
}

export const EmptyEventsPlaceholder = (props: EmptyEventsPlaceholderProps) => {
    return <div className='new_dyor_disclaimer dyor_warning'>
        No transfers to show
    </div>
}