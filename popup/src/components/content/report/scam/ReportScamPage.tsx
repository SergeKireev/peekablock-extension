import React, { useState } from 'react'
import { ReportScamForm } from './ReportScamForm';
import { ReportSuccess } from '../common/ReportSuccess';

interface ReportScamPageProps {
    referrer?: string
}

export const ReportScamPage = (props: ReportScamPageProps) => {
    const [submitSuccessful, setSubmitSuccessful] = useState(false);
    const [submitted, setSubmitted] = useState(undefined);

    const onSubmitSuccessful = () => {
        setSubmitSuccessful(true);
    }

    const reportScamSuccessMessage = `Now the crypto community is safer.
You have reported 28 scams this month, good job!
You can keep helping the community by making a contribution.`
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
                    referrer={props.referrer} />
        }
    </div>
} 