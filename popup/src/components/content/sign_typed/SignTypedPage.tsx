import React from 'react'
import { decodeParam } from '../../../lib/utils/uri';
import { NewContent } from '../NewContent';
import { messages } from '../../../lib/messages/messages';
import { NewHeader } from '../../header/NewHeader';
import { SignTypedSecurityAssessment } from './security/SignTypedSecurityAssessment';
import { SignTypedData } from '../../../lib/domain/sign_typed';
import { SignTyped } from './SignTyped';

interface SignTypedPageProps {
    referrer: string
    signTyped: SignTypedData
    reportScam: () => void
    reportBug: (message: string) => void
}

export const SignTypedPage = (props: SignTypedPageProps) => {
    return (
        <div className='new_container'>
            <NewHeader />
            <NewContent
                title={messages.SIGN}
                reportScam={props.reportScam}
            >
                <div className="new_content_body">
                    {
                        <div>
                            <SignTyped
                                signTyped={props.signTyped}
                                referrer={props.referrer}
                                reportScam={props.reportScam}
                            />
                            <SignTypedSecurityAssessment signTyped={props.signTyped} />
                        </div>
                    }
                </div>
            </NewContent>
        </div>
    )
}