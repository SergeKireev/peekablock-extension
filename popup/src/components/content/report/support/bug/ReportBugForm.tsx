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

interface ReportBug {
    type: number,
    description: string,
    domain: string,
}

const handleSubmit = async (bugType: number,
    bugDescription: string,
    projectUrl: string,
    setLoading: (b: boolean) => void,
    setError: (msg: string) => void,
    onSubmitSuccessful: () => void,
) => {
    const url = 'https://peekablock.com/bug_report'
    const body: ReportBug = {
        description: bugDescription,
        domain: projectUrl,
        type: bugType
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

interface ReportBugFormProps {
    onSubmitSuccessful: () => void
    referrer?: string
}

export const ReportBugForm = (props: ReportBugFormProps) => {
    const [_loading, setLoading] = useState(false);

    const [bugType, setBugType] = useState(0);
    const [bugTypeError, setBugTypeError] = useState(undefined);
    const handleBugTypeChange = createHandler(setBugType, setBugTypeError);

    const [projectUrl, setProjectUrl] = useState(props.referrer)
    const [projectUrlError, setProjectUrlError] = useState(undefined)
    const handleProjectUrlChange = createHandler(setProjectUrl, setProjectUrlError);

    const [bugDescription, setBugDescription] = useState(undefined)
    const [generalError, setGeneralError] = useState(undefined);

    const handleBugDescriptionChange = createHandler(setBugDescription, setGeneralError);

    const validateForm = () => {
        let hasError = false;
        if (bugDescription === undefined) {
            setGeneralError('Bug description cannot be empty')
            hasError = true;
        }
        if (projectUrl === undefined) {
            setProjectUrlError('Project url cannot be empty')
            hasError = true;
        }
        return hasError;
    }

    return <div>
        <div className='new_report_bug_header_container'>
            <div>
                <h3>Report a bug to help us improve</h3>
                <p>You have encountered a bug using peekablock, please help us resolve the issue</p>
            </div>
        </div>
        <div className="new_report_form_group">
            <TextField select
                required
                className="report_form_input"
                id="type-of-bug"
                label="Type of bug"
                error={
                    bugTypeError != undefined
                }
                helperText={
                    bugTypeError
                }
                value={bugType}
                onChange={handleBugTypeChange}
            >
                {
                    bugTypes.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))
                }
            </TextField>
            <TextField required
                className="report_form_input"
                id="url"
                label="URL"
                error={
                    projectUrlError != undefined
                }
                helperText={
                    projectUrlError
                }
                value={projectUrl}
                onChange={handleProjectUrlChange}
            />
            <TextareaAutosize
                className="report_form_text"
                id="bug-description"
                required
                value={bugDescription}
                onChange={handleBugDescriptionChange}
                aria-label="minimum height"
                minRows={7}
                placeholder="Describe the bug"
            />
            <LoadingButton
                loading={_loading}
                variant="contained"
                color="secondary"
                className="report_form_submit"
                onClick={() => {
                    if (!validateForm())
                        handleSubmit(bugType,
                            bugDescription,
                            projectUrl,
                            setLoading,
                            setGeneralError,
                            props.onSubmitSuccessful)
                }}
            >
                Click to report
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