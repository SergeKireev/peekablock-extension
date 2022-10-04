import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Tab } from '@mui/material';
import React, { useState } from 'react'
import { ReportBugForm } from './bug/ReportBugForm';
import { ReportSuccess } from '../common/ReportSuccess';
import { RequestFeatureForm } from './feature/RequestFeatureForm';
import { ErrorContext } from '../../home/HomePage';
import { StyledTab } from '../../../common/tabs/StyledTab';

interface SupportPageProps {
    back?: () => void
    errorContext: ErrorContext
    referrer?: string
}

function createSuccessMessage() {
    const title = 'Thank you for your report!'
    const message = `We are working hard to reply and solve your problem as soon as possible. You are going to receive an answer during the next 48 hours.`
    return <ReportSuccess title={title} message={message} submitted={undefined} />
}

export const SupportPage = (props: SupportPageProps) => {
    const [submitSuccessful, setSubmitSuccessful] = useState(false);
    const [currentTab, setCurrentTab] = useState('1');


    const onSubmitSuccessful = () => {
        setSubmitSuccessful(true);
        setTimeout(() => {
            console.log('Back to report page');
            if (props.back) {
                props.back();
                setSubmitSuccessful(false);
            } else {
                setSubmitSuccessful(false);
            }
        }, 5000);
    }

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setCurrentTab(newValue);
    };

    return <div className='new_content_box'>
        {
            submitSuccessful ?
                createSuccessMessage() :
                <TabContext value={currentTab}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }} className='report_page_tab_header'>
                        <TabList
                            onChange={handleChange}
                            aria-label="lab API tabs example"
                            indicatorColor='secondary'
                            textColor='secondary'
                        >
                            <StyledTab
                                label="Report bug"
                                value="1"
                            />
                            <StyledTab
                                label="Request feature"
                                value="2"
                            />
                        </TabList>
                    </Box>
                    <TabPanel value="1" className='report_page_panel'>
                        <ReportBugForm
                            errorContext={props.errorContext}
                            onSubmitSuccessful={onSubmitSuccessful}
                            referrer={props.referrer} />
                    </TabPanel>
                    <TabPanel value="2" className='report_page_panel'>
                        <RequestFeatureForm
                            onSubmitSuccessful={onSubmitSuccessful}
                            referrer={props.referrer} />
                    </TabPanel>
                </TabContext>
        }
    </div>
} 