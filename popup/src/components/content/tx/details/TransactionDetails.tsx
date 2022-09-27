import { Timeline, TimelineConnector, TimelineContent, TimelineDot, TimelineItem, TimelineSeparator } from "@mui/lab"
import { timelineItemClasses } from '@mui/lab/TimelineItem';
import { Accordion, AccordionDetails, AccordionSummary, Typography } from "@mui/material"
import React from "react"
import { Address, Event } from "../../../../lib/domain/event"
import { SimulationResult } from "../../../../lib/domain/simulation"
import { messages } from "../../../../lib/messages/messages";
import { EventRowDetails } from "./EventRowDetails";

const ExpandMoreIcon = () => {
    return <img src='./assets/expand_icon.svg' style={{ width: 20 }} />
}

interface TransactionProps {
    simulationResult: SimulationResult,
    me: Address,
    target: Address
}

const isIn = (event: Event) => {
    return event.to.label === 'me';
}

const isOut = (event: Event) => {
    return event.from.label === 'me';
}

const buildTimelineItem = (event: Event, index: number, array: any[]) => {
    const length = array.length
    const color = isIn(event) ? 'success' :
        isOut(event) ? 'error' :
            'grey'
    return <TimelineItem key={index}>
        <TimelineSeparator>
            <TimelineDot hidden>
                {
                    color === 'success' ?
                        <img className="timeline_dot" src='./assets/timeline_spot_green.svg' /> :
                        color === 'error' ?
                            <img className="timeline_dot" src='./assets/timeline_spot_red.svg' /> :
                            <img className="timeline_dot" src='./assets/timeline_spot_grey.svg' />
                }
            </TimelineDot>
            {
                index === length - 1 ? undefined : <TimelineConnector />
            }
        </TimelineSeparator>
        <TimelineContent>
            <EventRowDetails event={event} />
        </TimelineContent>
    </TimelineItem>
}


export const TransactionDetails = (props: TransactionProps) => {
    //We are only interested in events which are a transfer in or out
    const allEvents = props.simulationResult ? props.simulationResult.allEvents.filter(x => isOut(x) || isIn(x)) : [];
    return <Accordion className="transaction_details_accordion">
        <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
        >
            <Typography fontSize={20}
                fontWeight={500}
            >{messages.TRANSACTION_DETAILS}</Typography>
        </AccordionSummary>
        <AccordionDetails className='transaction_details_accordion_details'>
            <Timeline sx={{
                [`& .${timelineItemClasses.root}:before`]: {
                    flex: 0,
                    padding: 0,
                },
            }}>
                {
                    allEvents.map(buildTimelineItem)
                }
            </Timeline>
        </AccordionDetails>
    </Accordion>
}