import { MenuItem, TextField, Alert, AlertTitle } from '@mui/material'
import React, { useState } from 'react'
import { Form } from '../../../common/form/Form';
import { StyledLoadingButton } from '../../../common/button/StyledLoadingButton';
import { SCALING_FACTOR } from '../../../common/body/global';
import { ScaledTextField } from '../../../common/input/ScaledTextField';
import { ScaledMenuItem } from '../../../common/menu/ScaledMenuItem';

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
    contract?: string
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

    const [projectContract, setProjectContract] = useState(props.contract)
    const handleProjectContractChange = createHandler(setProjectContract, () => { });

    const [generalError, setGeneralError] = useState(undefined);

    const validateForm = () => {
        let hasError = false;
        // if (projectName === undefined) {
        //     setProjectNameError('Project name cannot be empty')
        //     hasError = true;
        // }
        if (projectUrl === undefined) {
            setProjectUrlError('Project url cannot be empty')
            hasError = true;
        }
        return hasError;
    }

    return <Form
        title='Report a scam to help the community!'
        paragraph='You can contribute to the safety of the ecosystem by reporting something suspicious on Peekablock'
    >
        <ScaledTextField
            className="report_form_input"
            id="project-name"
            label="Project name"
            color='secondary'
            error={
                projectNameError != undefined
            }
            helperText={
                projectNameError
            }
            value={projectName}
            onChange={handleProjectNameChange}
        />
        <ScaledTextField required
            className="report_form_input"
            id="url"
            label="URL"
            color='secondary'
            error={
                projectUrlError != undefined
            }
            helperText={
                projectUrlError
            }
            value={projectUrl}
            onChange={handleProjectUrlChange}
        />
        <ScaledTextField select
            required
            className="report_form_input"
            id="type-of-scam"
            label="Type of scam"
            color='secondary'
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
                    <ScaledMenuItem
                        key={option.value}
                        value={option.value}>
                        {option.label}
                    </ScaledMenuItem>
                ))
            }
        </ScaledTextField>
        <ScaledTextField
            className="report_form_input"
            id="contract-address"
            label="Contract address"
            value={projectContract}
            onChange={handleProjectContractChange}
        />
        <StyledLoadingButton
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
        </StyledLoadingButton>
        {
            generalError ?
                <Alert severity="error">
                    <AlertTitle>Error</AlertTitle>
                    {generalError}
                </Alert> : undefined
        }
    </Form>
} 