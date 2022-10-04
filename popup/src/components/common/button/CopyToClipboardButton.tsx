import { Button, Snackbar } from '@mui/material'
import copyToClipboard from 'copy-to-clipboard'
import React, { useState } from 'react'

interface CopyToClipboardProps {
    text: string
}

export const CopyToClipboardButton = (props: CopyToClipboardProps) => {
    const [snackOpen, setSnackOpen] = useState(false);
    const handleClick = () => {
        setSnackOpen(true)
        copyToClipboard(props.text)
    };

    const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackOpen(false)
    }
    return <>
        <Button
            variant="outlined"
            color="secondary"
            className="new_report_success_share_button"
            id='share-button'
            onClick={handleClick}
        >
            <i className="fa fa-clone" />&nbsp;
        </Button>
        <Snackbar
            open={snackOpen}
            autoHideDuration={1000}
            onClose={handleClose}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center'
            }}
        >
            <div className='copy_to_clipboard_snack'>
                Copied to clipboard!
            </div>
        </Snackbar>
    </>
}