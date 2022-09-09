import React from 'react'
import { ReportForm } from './report/ReportForm'

export const NewContent = () => {
    return <div className="new_content">
        <span style={{ visibility: 'hidden' }}>.</span>
        <div className='new_content_title'>
            Report a problem
        </div>
        <ReportForm />
        <span style={{ visibility: 'hidden' }}>.</span>
    </div>
}