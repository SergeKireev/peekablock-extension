import React from "react"

export const HomeContent = () => {
    return <div className='new_content_box'>
        <div className='new_report_scam_header_container'>
            <div>
                <h3>Hello new Peekablocker!</h3>
                <p>Peekablock is created to keep web3 users safe from scammers</p>
            </div>
        </div>
        <div className='new_home_analysis_list'>
            <div>We use multiple factors of analysis to prevent threats to your assets:</div>
            <li>Domain name analysis</li>
            <li>Contract analysis</li>
            <li>Transaction simulation analysis</li>
        </div>
    </div>
}