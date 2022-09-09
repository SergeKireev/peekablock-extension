import { Button, MenuItem, TextField } from '@mui/material'
import React, { useState } from 'react'

const scamTypes = [
    {
        value: 'not-open',
        label: 'Peekablock did not open',
    },
    {
        value: 'wallet-drain',
        label: 'Wallet drain',
    },
    {
        value: 'fake-mint',
        label: 'Fake mint',
    }
];

const handleSubmit = (scamType: string, projectName: string, projectUrl: string, projectContract: string) => {
    const url = 'https://peekablock.com/report'
    const body: any = {
        scamType: scamType,
        projectName: projectName,
        projectUrl: projectUrl,
        projectContract: projectContract
    }
    fetch(url, {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(body)
    })
}

export const ReportForm = () => {
    const [scamType, setScamType] = useState('not-open');
    const handleScamTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setScamType(event.target.value);
    };

    const [projectName, setProjectName] = useState(undefined)
    const handleProjectNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setProjectName(event.target.value);
    };
    const [projectUrl, setProjectUrl] = useState(undefined)

    const handleProjectUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setProjectUrl(event.target.value);
    };

    const [projectContract, setProjectContract] = useState(undefined)
    const handleProjectContractChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setProjectContract(event.target.value);
    };

    return <div className='new_report_form'>
        <div>
            <h3>Report a new scam to help the community</h3>
            <p>If you suspect about a project or you confirm that is a scam, please notify the community to avoid other users getting affected.</p>
        </div>
        <TextField required
            className="report_form_input"
            id="project-name"
            label="Project name"
            value={projectName}
            onChange={handleProjectNameChange}
        />
        <TextField required
            className="report_form_input"
            id="url"
            label="URL"
            value={projectUrl}
            onChange={handleProjectUrlChange}
        />
        <TextField select
            required
            className="report_form_input"
            id="type-of-scam"
            label="Type of scam"
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
        <Button
            onClick={() => handleSubmit(scamType, projectName, projectUrl, projectContract)}>
            Submit
        </Button>
    </div>
} 