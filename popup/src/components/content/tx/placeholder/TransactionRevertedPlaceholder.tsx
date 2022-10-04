import React from 'react'

interface TransactionRevertedPlaceholderProps {
    message: string
}

export const TransactionRevertedPlaceholder = () => {
    return <div className='new_dyor_disclaimer dyor_warning'>
        Transaction reverted
    </div>
}