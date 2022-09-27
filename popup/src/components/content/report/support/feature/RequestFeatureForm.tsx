import { MenuItem, TextField, Alert, AlertTitle, TextareaAutosize } from '@mui/material'
//@ts-ignore
import LoadingButton from '@mui/lab/LoadingButton';
import React, { useState } from 'react'

const bugTypes = [
    {
        value: 0,
        label: 'Peekablock did not open',
    },
    {
        value: 1,
        label: 'Peekablock simulation failed',
    },
    {
        value: 2,
        label: 'Peekablock shows wrong result',
    }
];

interface RequestFeature {
    description: string,
}

const handleSubmit = async (featureDescription: string,
    setLoading: (b: boolean) => void,
    setError: (msg: string) => void,
    onSubmitSuccessful: () => void,
) => {
    const url = 'https://peekablock.com/feature_request'
    const body: RequestFeature = {
        description: featureDescription
    }
    setLoading(true);
    const response: any = await fetch(url, {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(body)
    }).catch(e => {
        setError(e.message);
    })
    const data = await response.json()
    if (data.status === 'nok') {
        setError(data.msg);
        setLoading(false);
    } else {
        setTimeout(() => {
            setLoading(false);
            onSubmitSuccessful();
        }, 1000);
    }
}

interface WithValue {
    value: any
}

function createHandler<T extends WithValue>(setVariable: any, setError: any) {
    return (event: React.ChangeEvent<T>) => {
        setVariable(event.target.value);
        setError(undefined);
    }
}

interface RequestFeatureFormProps {
    onSubmitSuccessful: () => void
    referrer?: string
}

export const RequestFeatureForm = (props: RequestFeatureFormProps) => {
    const [_loading, setLoading] = useState(false);

    const [featureDescription, setFeatureDescription] = useState(undefined)
    const [generalError, setGeneralError] = useState(undefined);
    const handleFeatureDescriptionChange = createHandler(setFeatureDescription, setGeneralError);

    const validateForm = () => {
        let hasError = false;
        if (featureDescription === undefined) {
            setGeneralError('Bug description cannot be empty')
            hasError = true;
        }
        return hasError;
    }

    return <div>
        <div className='new_report_bug_header_container'>
            <div>
                <h3>Is there a feature missing?</h3>
                <p>Help us improve Peekablock by advising new possible features.</p>
            </div>
        </div>
        <div className="new_report_form_group">
            <TextareaAutosize
                className="report_form_text"
                id="feature-description"
                required
                value={featureDescription}
                onChange={handleFeatureDescriptionChange}
                aria-label="minimum height"
                minRows={10}
                placeholder="Describe the feature"
            />
            <LoadingButton
                loading={_loading}
                variant="contained"
                color="secondary"
                className="report_form_submit"
                onClick={() => {
                    if (!validateForm())
                        handleSubmit(featureDescription,
                            setLoading,
                            setGeneralError,
                            props.onSubmitSuccessful)
                }}
            >
                Click to submit
            </LoadingButton>
            {
                generalError ?
                    <Alert severity="error">
                        <AlertTitle>Error</AlertTitle>
                        {generalError}
                    </Alert> : undefined
            }
        </div>
    </div>
} 