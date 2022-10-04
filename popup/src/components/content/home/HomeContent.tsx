import { Button } from "@mui/material"
import React from "react"
import { messages } from "../../../lib/messages/messages"
import { StyledButton } from "../../common/button/StyledButton"

interface HomeContentProps {
    reportBug: () => void
    reportScam: () => void
}

export const HomeContent = (props: HomeContentProps) => {
    return <div className='new_content_box'>
        <div className='new_home_content_container'>
            <img className='new_home_logo' src='./assets/peekablock_logo.svg' />
            <div className="new_home_motto">You shouldn’t need to read code to understand what you sign</div>
            <div className='new_home_title'>Peek at your transaction before signing it</div>
            <div className='new_home_explanation'>Peekablock simulates & shows you the effects of a transaction and alerts you if there is anything suspicious</div>
            <div className='new_home_action_row'>
                <StyledButton
                    variant="text"
                    color="secondary"
                    onClick={() => {}}
                >
                    How to contribute
                </StyledButton>
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
                    {messages.REPORT_SCAM}
                </StyledButton>
            </div>
        </div>
    </div >
}