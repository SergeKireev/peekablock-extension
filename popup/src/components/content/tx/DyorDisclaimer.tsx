import React from "react"

type Style = 'warning' | 'error'

export interface DyorDisclaimerProps {
    style: Style,
    title: string,
    message: string
}

export const DyorDisclaimer = (props: DyorDisclaimerProps) => {

    const styleClassName = props.style === 'warning' ? 'dyor_warning' : 'dyor_error'
    const styleConeImage = props.style === 'warning' ? './assets/warning_triangle.svg' : './assets/error_triangle.svg'

    return <div className={`new_dyor_disclaimer ${styleClassName}`}>
        <div className="new_dyor_disclaimer_row">
            <div className='new_dyor_title'>
                {props.title}
            </div>
            <div className='new_dyor_alert'>
                <img src={styleConeImage} />
            </div>
        </div>
        <div className="new_dyor_disclaimer_row">
            <div className='new_dyor_text'>
                {props.message}
            </div>
        </div>
    </div>
}