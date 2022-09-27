import { MenuItem, TextField, Alert, AlertTitle } from '@mui/material'
//@ts-ignore
import LoadingButton from '@mui/lab/LoadingButton';
import React, { useState } from 'react'

const scamTypes = [
    {
        value: 0,
        label: 'Fake mint',
    },
    {
        value: 1,
        label: 'Wallet drain',
    },
    {
        value: 2,
        label: 'Other',
    },

];

interface ReportScam {
    scamType: number,
    projectName: string,
    url: string,
    contract: string
}

const handleSubmit = async (scamType: number,
    projectName: string,
    projectUrl: string,
    projectContract: string,
    setLoading: (b: boolean) => void,
    setError: (msg: string) => void,
    onSubmitSuccessful: () => void,
    setSubmitted: (sub: any) => void
) => {
    const url = 'https://peekablock.com/report'
    const body: ReportScam = {
        scamType: scamType,
        projectName: projectName,
        url: projectUrl,
        contract: projectContract ? projectContract : '0x0'
    }
    setLoading(true);
    setSubmitted(body);
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

function createHandler(setVariable: any, setError: any) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
        setVariable(event.target.value);
        setError(undefined);
    }
}

interface ReportScamFormProps {
    onSubmitSuccessful: () => void
    setSubmitted: (sub: any) => void
    referrer?: string
}

export const ReportScamForm = (props: ReportScamFormProps) => {
    const [_loading, setLoading] = useState(false);

    const [scamType, setScamType] = useState(0);
    const [scamTypeError, setScamTypeError] = useState(undefined);
    const handleScamTypeChange = createHandler(setScamType, setScamTypeError);

    const [projectName, setProjectName] = useState(undefined)
    const [projectNameError, setProjectNameError] = useState(undefined)
    const handleProjectNameChange = createHandler(setProjectName, setProjectNameError);

    const [projectUrl, setProjectUrl] = useState(props.referrer)
    const [projectUrlError, setProjectUrlError] = useState(undefined)
    const handleProjectUrlChange = createHandler(setProjectUrl, setProjectUrlError);

    const [projectContract, setProjectContract] = useState(undefined)
    const handleProjectContractChange = createHandler(setProjectContract, () => { });

    const [generalError, setGeneralError] = useState(undefined);

    const validateForm = () => {
        let hasError = false;
        if (projectName === undefined) {
            setProjectNameError('Project name cannot be empty')
            hasError = true;
        }
        if (projectUrl === undefined) {
            setProjectUrlError('Project url cannot be empty')
            hasError = true;
        }
        return hasError;
    }

    return <div>
        <div className='new_report_scam_header_container'>
            <div>
                <h3>Report a new scam to help the community</h3>
                <p>If you suspect about a project or you confirm that is a scam, please notify the community to avoid other users getting affected.</p>
            </div>
        </div>
        <div className="new_report_form_group">
            <TextField required
                className="report_form_input"
                id="project-name"
                label="Project name"
                error={
                    projectNameError != undefined
                }
                helperText={
                    projectNameError
                }
                value={projectName}
                onChange={handleProjectNameChange}
            />
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
            <TextField select
                required
                className="report_form_input"
                id="type-of-scam"
                label="Type of scam"
                error={
                    scamTypeError != undefined
                }
                helperText={
                    scamTypeError
                }
                value={scamType}
                onChange={handleScamTypeChange}
            >
                {
                    scamTypes.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))
                }
            </TextField>
            <TextField
                className="report_form_input"
                id="contract-address"
                label="Contract address (optional)"
                value={projectContract}
                onChange={handleProjectContractChange}
            />
            <LoadingButton
                loading={_loading}
                variant="contained"
                color="secondary"
                className="report_form_submit"
                onClick={() => {
                    if (!validateForm())
                        handleSubmit(scamType,
                            projectName,
                            projectUrl,
                            projectContract,
                            setLoading,
                            setGeneralError,
                            props.onSubmitSuccessful,
                            props.setSubmitted)
                }}
            >
                <i className="fa fa-exclamation-triangle" aria-hidden="true" />&nbsp;
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