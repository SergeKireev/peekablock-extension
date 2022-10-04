import { Button } from '@mui/material'
import React from 'react'
import { messages } from '../../lib/messages/messages'
import { StyledButton } from '../common/button/StyledButton'

interface NewContentProps {
    titleIcon?: string
    title: string,
    reportScam?: () => void
    back?: () => void
    hideTitle?: boolean
}

export const NewContent = (props: React.PropsWithChildren<NewContentProps>) => {
    return <div className='new_content'>
        {
            props.hideTitle ? undefined :
                <div>
                    <div className='new_content_title_row'>
                        {
                            props.titleIcon ?
                                <div>
                                    <img src={props.titleIcon} style={{ height: 20 }} />
                                </div> :
                                undefined
                        }
                        {
                            props.back ?
                                <div>
                                    <Button
                                        onClick={props.back}
                                        variant="text"
                                        className='new_chevron_back'
                                    >
                                        <img src="./assets/chevron_left.svg" />
                                    </Button>
                                </div> : undefined
                        }
                        <div className='new_content_title'>
                            {props.title}
                        </div>
                        {
                            props.reportScam ? <StyledButton
                                className='report_scam_button'
                                variant="contained"
                                color="secondary"
                                onClick={props.reportScam}>
                                <img src='./assets/warning_triangle_white.svg' />
                                {messages.REPORT_SCAM}
                            </StyledButton> :
                                undefined
                        }
                    </div>
                </div>
        }
        {props.children}
    </div>
}