import React from 'react'
import { SignTypedData } from '../../../../lib/domain/sign_typed'
import { DyorDisclaimer } from '../../tx/security/DyorDisclaimer'

function dyorDisclaimer(signTyped: SignTypedData) {
    const title = `You are signing a valid message on the ${signTyped?.domain?.name} contract`
    const message = `This signature can be used against you in the ${signTyped?.domain?.name} ecosystem`
    return <DyorDisclaimer title={title} message={message} style={'warning'}/>
}

interface SignTypedSecurityAssessmentProps {
    signTyped: SignTypedData
}

export const SignTypedSecurityAssessment = (props: SignTypedSecurityAssessmentProps) => {
    return <div className='new_content_box'>
        <div className='security_assessment_header'>
            Security assessment
        </div>
        <div className='security_assessment'>
            {
                dyorDisclaimer(props.signTyped)
            }
        </div>
        <div className='security_assessment_reported_message'>
            This project has not been reported by community users
        </div>
    </div>
}