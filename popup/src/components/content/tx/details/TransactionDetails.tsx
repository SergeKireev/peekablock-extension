import { Timeline, TimelineConnector, TimelineContent, TimelineDot, TimelineItem, TimelineSeparator } from "@mui/lab"
import { timelineItemClasses } from '@mui/lab/TimelineItem';
import { Accordion, AccordionDetails, AccordionSummary, Typography } from "@mui/material"
import React from "react"
import { Address, Event } from "../../../../lib/domain/event"
import { SimulationResult } from "../../../../lib/domain/simulation"
import { USER_LABEL } from "../../../../lib/domain/user";
import { messages } from "../../../../lib/messages/messages";
import { reorder } from "../../../../lib/utils/event_order_util";
import { EventRowDetails } from "./EventRowDetails";

const ExpandMoreIcon = () => {
    return <img src='./assets/expand_icon.svg' style={{ width: 20 }} />
}

interface TransactionProps {
    simulationResult: SimulationResult,
    me: Address,
    target: Address,
    chainId: number
}

const isIn = (event: Event) => {
    return event.to.label === USER_LABEL;
}

const isOut = (event: Event) => {
    return event.from.label === USER_LABEL;
}

const buildSendTimelineItem = (event: Event, index: number, chainId: number) => {
    const color = isOut(event) ? 'error' : 'grey'

    const dotImgUrl = color === 'error' ?
        './assets/timeline_spot_red.svg' :
        './assets/timeline_spot_grey.svg'

    return <TimelineItem key={index}>
        <TimelineSeparator>
            <TimelineDot hidden>
                <img className="timeline_dot" src={dotImgUrl} /> :
            </TimelineDot>
            <TimelineConnector>
                <div className='event_details_timeline_connector'>
                    <img src='./assets/divider.svg' />
                    <img src='./assets/arrow_down.svg' />
                </div>
            </TimelineConnector>
        </TimelineSeparator>
        <TimelineContent>
            <EventRowDetails
                event={event}
                direction={'OUT'}
                actor={event.from}
                chainId={chainId}
            />
        </TimelineContent>
    </TimelineItem>
}

const buildReceiveTimelineItem = (event: Event, index: number, chainId: number) => {
    const color = isIn(event) ? 'success' :
        'grey'

    const dotImgUrl = color === 'success' ?
        './assets/timeline_spot_green.svg' :
        './assets/timeline_spot_grey.svg'

    return <TimelineItem key={index}>
        <TimelineSeparator>
            <TimelineDot hidden>
                <img className="timeline_dot" src={dotImgUrl} /> :
            </TimelineDot>
        </TimelineSeparator>
        <TimelineContent>
            <EventRowDetails
                event={event}
                direction={'IN'}
                actor={event.to}
                chainId={chainId} />
        </TimelineContent>
    </TimelineItem>
}

export const TransactionDetails = (props: TransactionProps) => {
    //We are only interested in events which are a transfer in or out
    let allEvents = []
    if (props.simulationResult) {
        allEvents = reorder(props.simulationResult.allEvents);
    }

    const disabled = !props.simulationResult || props.simulationResult.allEvents.length === 0 || props.simulationResult.reverted
    const timelineEventsNested = allEvents.map((e, i) => [
        buildSendTimelineItem(e, i * 2, props.chainId),
        buildReceiveTimelineItem(e, i * 2 + 1, props.chainId)
    ])
    const timelineEvents = [].concat(...timelineEventsNested)

    return <Accordion disabled={disabled} className="transaction_details_accordion">
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
                    timelineEvents
                }
            </Timeline>
        </AccordionDetails>
    </Accordion>
}