import React, { useState } from 'react'
import { ReportScamForm } from './ReportScamForm';
import { ReportSuccess } from '../common/ReportSuccess';

interface ReportScamPageProps {
    referrer?: string
    contract?: string
}

export const ReportScamPage = (props: ReportScamPageProps) => {
    const [submitSuccessful, setSubmitSuccessful] = useState(false);
    const [submitted, setSubmitted] = useState(undefined);

    const onSubmitSuccessful = () => {
        setSubmitSuccessful(true);
    }

    const reportScamSuccessMessage = `You have successfully reported a warning! Thanks to you the community is safer`
    const reportScamSuccessTitle = 'Thank you for your report!'

    return <div className='new_content_box'>
        {
            submitSuccessful ?
                <ReportSuccess
                    title={reportScamSuccessTitle}
                    message={reportScamSuccessMessage}
                    submitted={submitted}
                    share
                /> :
                <ReportScamForm
                    onSubmitSuccessful={onSubmitSuccessful}
                    setSubmitted={setSubmitted}
                    referrer={props.referrer}
                    contract={props.contract}
                />
        }
    </div>
} 