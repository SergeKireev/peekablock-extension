import { CircularProgress } from '@mui/material';
import React from 'react'
import { Address, ConsolidatedEvent } from '../../../../lib/domain/event';
import { SimulationResult } from '../../../../lib/domain/simulation';
import { findApprove, isApprove, isOnlyOut } from '../../../../lib/security/assessment';
import { DyorDisclaimer, DyorDisclaimerProps } from './DyorDisclaimer';

interface SecurityAssessmentProps {
    simulationResult: SimulationResult | undefined
}

const approveOnlyDisclaimerProps = (counterparty: Address): DyorDisclaimerProps => {
    return {
        title: 'Warning, suspicious transaction',
        message: `You are about to give approval to part of your assets. Please make sure you trust the address ${counterparty.label}`,
        style: 'error'
    }
}

const onlyOutDisclaimerProps = (): DyorDisclaimerProps => {
    return {
        title: 'Warning, suspicious transaction',
        message: 'You are about to send your assets without receiving anything in return',
        style: 'error'
    }
}

const normalDisclaimerProps = (): DyorDisclaimerProps => {
    return {
        title: 'Always do your own research',
        message: 'No warnings have been found or reported.',
        style: 'warning'
    }
}

const dyorDisclaimer = (events: ConsolidatedEvent[], reverted: boolean) => {
    const _isApprove = isApprove(events);
    const _isOnlyOut = isOnlyOut(events);

    let warningProps = _isApprove ? approveOnlyDisclaimerProps(findApprove(events).to) :
        _isOnlyOut ? onlyOutDisclaimerProps() :
            normalDisclaimerProps()

    if (reverted || events.length === 0) {
        warningProps = normalDisclaimerProps()
    }

    return <DyorDisclaimer
        {...warningProps}
    />
}

export const SecurityAssessment = (props: SecurityAssessmentProps) => {
    const isLoading = !props.simulationResult

    return <div className='new_content_box'>
        <div className='security_assessment_header'>
            Security assessment
        </div>
        <div className='security_assessment'>
            {
                isLoading ?
                    <CircularProgress color='secondary' /> :
                    dyorDisclaimer(props.simulationResult.consolidated, props.simulationResult.reverted)
            }
        </div>
        <div className='security_assessment_reported_message'>
            This project has not been reported by community users
        </div>
    </div>
}