import { Button } from '@mui/material'
import React from 'react'
import { CopyToClipboardButton } from '../../../common/button/CopyToClipboardButton'
import { StyledButton } from '../../../common/button/StyledButton'
import { StyledLinkButton } from '../../../common/button/StyledLinkButton'

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
                        <StyledButton
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
                        </StyledButton>
                        <CopyToClipboardButton text={tweetText} />
                    </div> : undefined
            }
            {
                props.share ?
                    <StyledLinkButton
                        color="secondary"
                        fontWeight={'bold'}
                        enableRipple
                        enableHover
                        paddingHorizontal={15}
                        paddingVertical={5}
                        onClick={() => { }}
                        link='https://github.com/SergeKireev/peekablock-extension'
                    >
                        Contribute
                    </StyledLinkButton> : undefined
            }
        </div>
    </div>
}