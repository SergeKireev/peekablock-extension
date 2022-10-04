import { Button } from '@mui/material'
import React from 'react'
import { CopyToClipboardButton } from '../../../common/button/CopyToClipboardButton'

let _browser = undefined
let isChrome = undefined
try {
    //@ts-ignore
    _browser = browser ? browser : chrome
    isChrome = false
} catch {
    //@ts-ignore
    _browser = chrome
    isChrome = true
}

interface ReportSuccessProps {
    title: string,
    message: string,
    share?: boolean,
    submitted: any
}

export const ReportSuccess = (props: ReportSuccessProps) => {
    const title = props.title
    let link;
    let tweetText;
    if (props.share) {
        const domain = props.submitted.url;
        const submittedContract = props.submitted.contract
        const safeDomain = domain.replaceAll('.', '[.]')
        tweetText = encodeURI(
            `@p33kablock\ndomain:${safeDomain}\ncontract:${submittedContract}\n`
        );
        link = `https://twitter.com/intent/tweet?text=${tweetText}&hashtags=ScamReport`
    }

    return <div className='new_report_form_group'>
        <div className='new_report_success_container'>
            <img src="./assets/checkmark.svg" className='report_success_checkmark' />
            <div className='new_report_success_title'>
                {title}
            </div>
            <p className='new_report_success_message'>
                {props.message}
            </p>
            {
                props.share ?
                    <div className='share_button_row'>
                        <Button
                            variant="contained"
                            color="secondary"
                            className="new_report_success_share_button"
                            id='share-button'
                            onClick={() => {
                                window.open(link, '_blank');
                            }}
                        >
                            <i className="fa fa-share-alt" />&nbsp;
                            Share
                        </Button>
                        <CopyToClipboardButton text={tweetText}/>
                    </div> : undefined
            }
            {
                props.share ?
                    <Button
                        color="secondary"
                        className="new_report_success_share_button"
                    >
                        Contribute
                    </Button> : undefined
            }
        </div>
    </div>
}