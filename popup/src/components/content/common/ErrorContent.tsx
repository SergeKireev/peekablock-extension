import { Button } from '@mui/material'
import React from 'react'

interface ErrorProps {
    message: string
    reportBug: (msg: string) => void
}

//TODO: Change all texts to message variable
export const ErrorContent = (props: ErrorProps) => {
    return <div className='new_content_box'>
        <div className='error_container'>
            <img className='error_image' src='./assets/cone.png'></img>
            <div className='error_title'>Sorry it seems we have run into a problem</div>
            <p className='error_message'>
                We were not able to emulate this transaction. Please click below to report this as a bug.
            </p>
            <Button
                variant='outlined'
                color='secondary'
                onClick={() => props.reportBug(props.message)}
            >
                <img src='./assets/bug.svg' style={{ height: 20, marginRight: 8 }}></img>
                Submit bug
            </Button>
        </div>
    </div>
}