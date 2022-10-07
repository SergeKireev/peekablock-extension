import React from "react"
import { messages } from "../../../lib/messages/messages"
import { StyledButton } from "../../common/button/StyledButton"
import { StyledLinkButton } from "../../common/button/StyledLinkButton"

interface HomeContentProps {
    reportBug: () => void
    reportScam: () => void
}

export const HomeContent = (props: HomeContentProps) => {
    return <div className='new_content_box'>
        <div className='new_home_content_container'>
            <div className='new_home_text'>
                <img className='new_home_logo' src='./assets/peekablock_logo.svg' />
                <div className='new_home_title'>Peek at your transaction<br />before signing it</div>
                <div className='new_home_explanation'>Peekablock shows you the effects of a transaction as a preview<br />and alerts you if there is anything suspicious</div>
            </div>
            <div className='new_home_action_row'>
                <StyledLinkButton
                    color="secondary"
                    fontWeight={'bold'}
                    enableRipple
                    enableHover
                    onClick={() => { }}
                    paddingHorizontal={15}
                    paddingVertical={5}
                    link='https://github.com/SergeKireev/peekablock-extension'
                >
                    Contribute
                </StyledLinkButton>
                <StyledButton
                    variant='outlined'
                    color='secondary'
                    onClick={props.reportBug}
                >
                    <img src='./assets/bug.svg' style={{ height: 20, marginRight: 8 }}></img>
                    Submit bug
                </StyledButton>
                <StyledButton
                    className='report_scam_button'
                    variant="contained"
                    color="secondary"
                    onClick={props.reportScam}>
                    <img src='./assets/warning_triangle_white.svg' />
                    {messages.REPORT_SCAM_HOME}
                </StyledButton>
            </div>
        </div>
    </div >
}